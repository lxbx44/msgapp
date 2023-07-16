const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('register', { error: null });
});

router.post('/', (req, res) => {
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

module.exports = router;

