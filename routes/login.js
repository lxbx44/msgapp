const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const db = require('./../utils/db');

const gotoapp = (req, res, next) => {
  const username = req.cookies.username;
  const name = req.cookies.name;

  if (username || name) {
    return res.redirect('/app');
  }
  next();
};

router.get('/', gotoapp, (req, res) => {
  res.render('login', { error: null });
});

router.post('/', (req, res) => {
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
          
        const { pfp_path: pfp } = user;

        res.cookie('username', user.username);
        res.cookie('name', user.name);
        res.cookie('email', user.email);
        res.cookie('pfp', JSON.stringify(pfp));

        return res.redirect('/app');
      });
    }
  );
});

module.exports = router;

