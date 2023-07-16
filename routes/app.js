const express = require('express');
const router = express.Router();

const auth = require('./auth')

router.get('/', auth, (req, res) => {
    const username = req.cookies.username;
    const name = req.cookies.name;
    res.render('app');
});

module.exports = router;
