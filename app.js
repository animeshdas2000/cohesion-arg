var createError = require ('http-errors');
var express = require ('express');
var path = require ('path');
var cookieParser = require ('cookie-parser');
var bodyParser = require ('body-parser');
const cors = require ('cors');
var logger = require ('morgan');
const firebase = require ('firebase');
const admin = require ('firebase-admin');
const config = require ('./config');
// firebase.initializeApp (config.firebaseConfigDev);
firebase.initializeApp (config.firebaseConfigProd);
// var serviceAccount = require ('./cohesion-c4eed-firebase-adminsdk-zb8ao-bd34d4ddad.json');
var serviceAccount = require ('./cohesion-production-firebase-adminsdk-htjby-cb97425855.json');
admin.initializeApp ({
  credential: admin.credential.cert (serviceAccount),
  // databaseURL: 'https://cohesion-c4eed-default-rtdb.firebaseio.com',
  databaseURL: 'https://cohesion-production-default-rtdb.firebaseio.com',
});

var indexRouter = require ('./routes/index');
var usersRouter = require ('./routes/users');

var app = express ();

// view engine setup
app.set ('views', path.join (__dirname, 'views'));
app.set ('view engine', 'ejs');

app.use (logger ('dev'));
app.use (express.json ());
app.use (cors ());
app.use (bodyParser.json ());
app.use (express.urlencoded ({extended: false}));
app.use (cookieParser ());
app.use (express.static (path.join (__dirname, 'public')));

app.use ('/', indexRouter);
app.use ('/users', usersRouter);

// catch 404 and forward to error handler
app.use (function (req, res, next) {
  next (createError (404));
});

// error handler
app.use (function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get ('env') === 'development' ? err : {};

  // render the error page
  res.status (err.status || 500);
  res.render ('error');
});

module.exports = app;
