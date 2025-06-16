var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongodb = require('./db/mongo');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catwaysRouter = require('./routes/catways');


mongodb.initClientDbConnection ();

var app = express();

app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/catways', catwaysRouter);

app.use('/', indexRouter);
app.use('/', usersRouter);

app.use(function(req, res, next) {
    res.status(404).json({name: 'API', version: '1.0', status: 404, message: 'not_found'});
});

module.exports = app;
