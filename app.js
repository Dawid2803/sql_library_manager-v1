var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//importing sequelize instance created in index 
const db = require('./models/index');
const {sequelize} = db;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');





var app = express();

//enables app to serve static files
app.use('/static', express.static('public'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


//testing connection to db with IIFE
(async () => {
  try{
    await sequelize.authenticate();
    console.log('connection succesful');
  }catch(error){
    console.error('unable to connect: ', error);
  }  
})();

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// custom 404 error for undefined routes
app.use((req, res, next) => {
  const err404 = new Error('Page Not Found');
  err404.status = 404;
  err404.message = "Oops looks like the page you were looking for does not exist!";
  next(err404);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if(err.status === 404){
    res.status(err.status);
    res.render('page-not-found', { err })
  }else{
    err.message = err.message || 'Sorry! There was an unexpected error on the server.';
    err.status = err.status || 500;

    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    console.log("Error message: ",err.message);
    console.log("Error Status: ", err.status)
    // render the error page
    res.status(err.status || 500);
    res.render('error', { err });
  }

});

module.exports = app;
