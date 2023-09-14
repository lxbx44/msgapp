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
    res.render('register', { error: null });
});

router.post('/', async (req, res) => {
    let { username, name, email, password, confirmPassword } = req.body;

    // Trim extra spaces before and after the name
    name = name.trim();

    // Validation checks for username, name, and password
    const usernameRegex = /^[a-zA-Z0-9_]{1,10}$/;
    const nameRegex = /^.{1,10}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!usernameRegex.test(username)) {
        return res.render('register', { error: 'Invalid username. It must contain only numbers, letters, and underscores, and be at most 10 characters long.' });
    }

    if (!nameRegex.test(name)) {
        return res.render('register', { error: 'Invalid name. It must be at most 10 characters long.' });
    }

    if (!passwordRegex.test(password)) {
        return res.render('register', { error: 'Invalid password. It must be at least 8 characters long and contain both letters and numbers.' });
    }

    if (password !== confirmPassword) {
        return res.render('register', { error: 'Passwords do not match' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)',
            [username, name, email, hash]
        );

        res.cookie('username', username);
        res.cookie('name', name);
        res.cookie('email', email);
        res.cookie('pfp', JSON.stringify(null));

        await db.query('UPDATE users SET pfp_path = NULL WHERE username = ?', [username]);
        return res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        return res.render('register', { error: 'Registration failed' });
    }
});

module.exports = router;
