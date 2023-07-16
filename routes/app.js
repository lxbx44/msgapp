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
    const username = req.cookies.username;
    const name = req.cookies.name;
    res.render('app', { name, username });
});

module.exports = router;
