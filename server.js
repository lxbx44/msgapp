const express = require('express');
const ejs = require('ejs'); 
const dotenv = require('dotenv').config();
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const appRouter = require('./routes/app');
const friendsRouter = require('./routes/friends');

const updateProfile = require('./routes/update-profile');
const removePfp = require('./routes/remove-pfp');
const sendFriendRequest = require('./routes/send-friend-request');
const acceptFr = require('./routes/accept-fr');

const db = require('./utils/db')

var app = express();

app.use(fileUpload());

app.use(cookieParser());


const PORT = process.env.PORT;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.listen(PORT);

app.set('views', 'views')

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
    res.redirect('/app')
});


app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/app', appRouter);
app.use('/friends', friendsRouter);

app.use('/update-profile', updateProfile);
app.use('/remove-pfp', removePfp);
app.use('/send-friend-request', sendFriendRequest);
app.use('/accept-fr', acceptFr);
