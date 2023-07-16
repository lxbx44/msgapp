const express = require('express');
const router = express.Router();

const auth = require('./auth');

router.get('/', auth, (req, res) => {
    res.clearCookie('username');
    res.clearCookie('name');
    res.clearCookie('email');

    res.redirect('/');
});

module.exports = router;

