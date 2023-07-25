const express = require('express');
const router = express.Router();
const db = require('./../utils/db')

const auth = require('./auth')

router.get('/', auth, (req, res) => {
    const username = req.cookies.username;
    const name = req.cookies.name;
    const email = req.cookies.email;

    db.query(
        'SELECT id FROM users WHERE username = ?',
        [username],
        (error, results) => {
            if (error) {
                console.error('Error retrieving user ID:', error);
                return res.render('error', { error: 'Failed to retrieve user ID' });
            }

            if (results.length === 0) {
                return res.render('error', { error: 'User not found' });
            }

            const userId = results[0].id;
            return res.render('profile', { username, name, email, userId });
        }
    )
});

module.exports = router;

