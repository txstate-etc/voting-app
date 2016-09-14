
require('babel-register')({
    presets: ['es2015', 'react']
});
require('dotenv').config();
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cas = require('./cas');
var cors = require('cors');

//for server-side React rendering
var ReactDOMServer = require('react-dom/server');
var React = require('react');
var match = require('react-router/lib/match');
var RouterContext = require('react-router/lib/RouterContext');
var clientRoutes = require('./client/router');

var exphbs  = require('express-handlebars');

//handlebars helpers
var helpers = require('./lib/helpers');

var login = require('./routes/login');
var routes = require('./routes/index');
var stages = require('./routes/stages');
var categories = require('./routes/categories');
var users = require('./routes/users');
var ideas = require('./routes/ideas');
var votes = require('./routes/votes');
var comments = require('./routes/comments');
var replies = require('./routes/replies');
var files = require('./routes/files');

var app = express(); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers      : helpers,

    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        //'shared/templates/',
        'views/partials/'
    ]
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//location for the static files (js, css, images)
app.use(express.static(path.join(__dirname, 'public')));

//methodOverride makes it easier to send PUT and DELETE.  If the client submits a form using
//POST with _method=PUT in the query string, it will be treated as a PUT
app.use(methodOverride('_method'));


// Set up an Express session, which is required for CASAuthentication.
// Some of the examples get the location of the config file from an environment variable
var config = require('./config.js');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var db = require("./models").sequelize;

//use a fake session for testing
if(app.get('env') === 'test'){
  app.use(function(req,res,next){
    req.session = {};
    req.session.user_id = "1";
    req.session.admin = 1;
    next();
  })
}
else{
  app.use( session({
      secret            : config.secret,
      store: new SequelizeStore({
        db: db
      }),
      maxAge: 1000 * 60 * 60 * 2, //2 hours
      resave            : false,
      saveUninitialized : true  //need to figure out why this option breaks supertest
  }));
}

app.use(cors());

//routes
app.use('/stages', stages);
app.use('/categories', categories);
app.use('/users', users);
app.use('/ideas', ideas);
app.use('/votes', votes);
app.use('/comments', comments);
app.use('/replies', replies);
app.use('/files', files);

app.use('/login', cas.bouncer, login);
app.use('/logout', function(req, res, next){
                      res.clearCookie('user');
                      delete req.session['user_id'];
                      delete req.session['admin'];
                      next();
                    }, cas.logout);


//all non-api routes go here
app.get('*', function(req, res) {
  res.render('index')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler (also test environment)
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'test' ) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.format({
        'text/html': function(){
            res.render('error', {
            message: err.message,
            error: err
          });
        },
        'application/json': function(){
            console.log("*** " + err.message + " ***");
            res.json(err);
        }
    });
    
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
