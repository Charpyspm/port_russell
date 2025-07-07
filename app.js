var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongodb = require('./db/mongo');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catwaysRouter = require('./routes/catways');
const catwaysPageRouter = require('./routes/catwaysPage');
const reservationsRouter = require('./routes/reservations');
const dashboardRouter = require('./routes/dashboard');
const editRouter = require('./routes/edit');
const registerRouter = require('./routes/register');


mongodb.initClientDbConnection ();

var app = express();

// confuguration de pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));


app.use('/', indexRouter);
app.use('/users', usersRouter);
console.log('catwaysRouter stack:', catwaysRouter.stack.map(l => l.name));
app.use('/catways', catwaysPageRouter);
app.use('/api/catways', catwaysRouter);
app.use('/reservations', reservationsRouter);
app.use('/dashboard', dashboardRouter);
app.use('/edit', editRouter);
app.use('/register', registerRouter);


app.use(function(req, res, next) {
    res.status(404).json({name: 'API', version: '1.0', status: 404, message: 'not_found'});
});

module.exports = app;
