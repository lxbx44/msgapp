const express = require('express');
const ejs = require('ejs'); 
const dotenv = require('dotenv').config();
const mysql = require('mysql');
const cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser());

const bcrypt = require('bcrypt');

const PORT = process.env.PORT;

const db = require('./routes/db')

const { authenticateUser, redAppIfLogin } = require('./routes/middlewares');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.listen(PORT);

db.connect((err) => {
    if (err) console.log(`Error connecting to db\nError: ${err}`);
})


app.get('/', redAppIfLogin, (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register', { error: null })
});
app.get('/login', (req, res) => {
    res.render('login', { error: null })
});

app.post('/register', (req, res) => {
    const { username, name, email, password } = req.body;

    bcrypt.genSalt(10, (error, salt) => {
        if (error) {
            console.error('Error generating salt:', error);
            return res.render('register', { error: 'Registration failed' });
        }

        bcrypt.hash(password, salt, (error, hash) => {
            if (error) {
                console.error('Error hashing password:', error);
                return res.render('register', { error: 'Registration failed' });
            }
            db.query(
                'INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)',
                [username, name, email, hash],
                (error, results) => {
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            return res.status(400).json({ message: 'Email or username already exists' });
                        }
                        console.error('Error registering user:', error);
                        return res.render('register', { error: 'Registration failed' });
                    }

                    res.cookie('username', username);
                    res.cookie('name', name);
                    res.cookie('email', email);

                    return res.redirect('/login');
                }
            );
        })
    });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (error, results) => {
      if (error) {
        console.error('Error logging in:', error);
        return res.render('login', { error: 'Login failed' });
      }

      if (results.length === 0) {
        return res.render('login', { error: 'Invalid credentials' });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) {
          console.error('Error comparing passwords:', error);
          return res.render('login', { error: 'Login failed' });
        }

        if (!isMatch) {
          return res.render('login', { error: 'Invalid credentials' });
        }

          return res.redirect('/app');
      });
    }
  );
});


app.get('/app', authenticateUser, (req, res) => {
    const username = req.cookies.username;
    const name = req.cookies.name;
    res.render('app', { name });
});
