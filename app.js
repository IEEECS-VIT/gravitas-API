'use strict';

require('dotenv').config({ silent: true });

const express = require('express');
const path = require('path');
const compression = require('compression');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var passport = require('passport');
const session = require('cookie-session');
const bluebird = require('bluebird');
require(path.join(__dirname, 'utilities', 'configure-passport'))(passport);

mongoose.Promise = bluebird;
mongoose.connect(process.env.MONGO_URI);


const login = require(path.join(__dirname, 'routes', 'index'));
const registration = require(path.join(__dirname, 'routes', 'registration'));
const organizer = require(path.join(__dirname, 'routes', 'organizer'));
const self = require(path.join(__dirname, 'routes', 'self'));
const sales = require(path.join(__dirname, 'routes', 'sales'));
const external = require(path.join(__dirname, 'routes', 'external'));
const eventsApi = require(path.join(__dirname, 'routes', 'events-api'));
const events = require(path.join(__dirname, 'routes', 'events'));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


let keys;
if (process.env.COOKIE_KEY1 && process.env.COOKIE_KEY2)
{
    keys = [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2];
}
else
{
    keys = ['keyboard', 'cat'];
}
let expiryDate = new Date( 5 * Date.now() + 60 * 60 * 1000 ); // 5 hours
app.use(session(
{
    keys    :  keys,
    secret  : process.env.COOKIE_SECRET || 'secret',
    cookie  :
    {
        secure: true,
        expires: expiryDate
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// set up message flashing
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//app.use('/', login);
//app.use('/registration', registration);
// app.use('/self', self);
//app.use('/sales', sales);
//app.use('/organizer', organizer);
// app.use('/external', external);
app.use('/api/events', eventsApi);
//app.use('/events', events);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// intercept unauthorized requests and redirect to index.
app.use(function (err, req, res, next) {
    if ( typeof err == mongoose.Error.ValidationError )
    {
        err.status = 400;
    }
    if (err.status == 400 || err.status == 403)
    {
        if (req.accepts('html')) {
            req.flash('error', err.message);
            return res.redirect('/');
        }

        if (req.accepts('json')) {
            return res.json(err);
        }
    }
    return next(err);
});

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        let error = {
            message: err.message,
            error: err
        };

        if (req.accepts('html')) {
            return res.render('error', error);
        }

        if (req.accepts('json')) {
            return res.json(error);
        }

        return res.send(error.error + ' ' + error.message);


    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    let error = {
        message: err.message,
        error: {}
    };

    if (req.accepts('html')) {
        return res.render('error', error);
    }

    if (req.accepts('json')) {
        return res.json(error);
    }

    return res.send(error.error + ' ' + error.message);

});


module.exports = app;
