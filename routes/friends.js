const express = require('express');
const router = express.Router();
const db = require('./../utils/db')

const auth = require('./auth')

router.get('/', auth, (req, res) => {
    const username = req.cookies.username;
    const name = req.cookies.name;
    const email = req.cookies.email;
    const userId = req.cookies.userId;
    const error = req.query.error;

    return res.render('friends', { username, name, email, userId, error });
});

module.exports = router;

