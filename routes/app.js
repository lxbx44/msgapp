const express = require('express');
const router = express.Router();

const auth = require('./auth')

router.get('/', auth, (req, res) => {
    const username = req.cookies.username;
    const name = req.cookies.name;
    const pfp = JSON.parse(req.cookies.pfp);

    res.render('app', { name, username, pfp });
});

module.exports = router;
