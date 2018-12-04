// error pop ups 

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
// parses cookies (small files which are stored)
// and populates req.cooki. transports data between client and server
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//body parsing middleware, populates the req.body with the
//value of the parameter of a post
//stores user data between HTTP request
var session = require('express-session');
//authenticate requests
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
const hbs = require('hbs');

var multer = require('multer');
var upload = multer({dest: './uploads'});
//stores messages and dsiaplys it to users
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');


// start of setting up middleware
//generate a detailed log using the dev format (predefined)
app.use(logger('dev'));
app.use(bodyParser.json());
//returns middleware that only parses url encoded bodies 
//and only looks at requests 
//when extended false, it returns value of str or arr
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//handles sesssions
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));


// passsport 
app.use(passport.initialize());
app.use(passport.session());

//validator
app.use(expressValidator({
	errorFormatter: function(param,msg, value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while (namespace.length){
			formParam += '[' +namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*',function(req,res,next){
	res.locals.user = req.user || null;
	next();
})

// app.get('/javascript/poke.js', function(req,res,next){
// 	res.locals
// })

app.use('/', routes);
app.use('/users', users);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
