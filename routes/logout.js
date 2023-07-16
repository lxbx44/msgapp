const express = require('express');
const router = express.Router();


const authenticateUser = (req, res, next) => {
    const username = req.cookies.username;
    const name = req.cookies.name;

    if (!username || !name) {
        return res.redirect('/');
    }

    next();
};


router.get('/', authenticateUser, (req, res) => {
    res.clearCookie('username');
    res.clearCookie('name');
    res.clearCookie('email');

    res.redirect('/');
});

module.exports = router;

