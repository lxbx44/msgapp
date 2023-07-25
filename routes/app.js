const express = require('express');
const router = express.Router();

const auth = require('./auth')

router.get('/', auth, (req, res) => {
    const username = req.cookies.username;
    const name = req.cookies.name;
    const email = req.cookies.email;
    const pfp = req.cookies.pfp.replace(/\"/g, "");

    res.render('app', { name, username, pfp, email });
});


module.exports = router;
