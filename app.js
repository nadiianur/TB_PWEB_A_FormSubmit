var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
dotenv.config();
var db = require("./config/database.js")
const session = require('express-session');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');
var formRouter = require('./routes/form');
var submissionRouter = require('./routes/submission');

var app = express();

app.use(session({
    secret: 'ACCESS_TOKEN_SECRET',
    resave: false,
    saveUninitialized: true
}));
app.use(cookieParser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'views'))); //nama folder css
// app.use(express.static(path.join(__dirname, 'node_modules')));



app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/form', formRouter);
app.use('/submission', submissionRouter);

module.exports = app;
