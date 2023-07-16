const express = require('express');
const ejs = require('ejs'); 
const dotenv = require('dotenv').config();
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const appRouter = require('./routes/app');

var app = express();

app.use(cookieParser());


const PORT = process.env.PORT;

const db = require('./utils/db')

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.listen(PORT);

db.connect((err) => {
    if (err) console.log(`Error connecting to db\nError: ${err}`);
})



const redAppIfLogin = (req, res, next) => {
    const username = req.cookies.username;
    const name = req.cookies.name;

    if (username || name) {
        return res.redirect('/app')
    }
    next();
};



app.get('/', redAppIfLogin, (req, res) => {
    res.render('index');
});


app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/app', appRouter);
