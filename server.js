const express = require('express');
const ejs = require('ejs'); 
const dotenv = require('dotenv').config();
const mysql = require('mysql');

const PORT = process.env.PORT;

// Init server
var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(PORT);


app.get('/', function (req, res) {
    res.render('index');
});
