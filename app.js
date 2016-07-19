
require('babel-register')({
    presets: ['es2015', 'react']
});
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cas = require('grand_master_cas'); 

//for server-side React rendering
var ReactDOMServer = require('react-dom/server');
var React = require('react');
var match = require('react-router/lib/match');
var RouterContext = require('react-router/lib/RouterContext');
var clientRoutes = require('./client/router');

var exphbs  = require('express-handlebars');

//handlebars helpers
var helpers = require('./lib/helpers');

var routes = require('./routes/index');
var stages = require('./routes/stages');
var categories = require('./routes/categories');
var users = require('./routes/users');
var ideas = require('./routes/ideas');
var votes = require('./routes/votes');
var comments = require('./routes/comments');

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

/********************************************************************/
// Set up an Express session, which is required for CASAuthentication. 
app.use( session({
    secret            : 'cas hates me',
    resave            : false,
    saveUninitialized : true  //need to figure out why this option breaks supertest
}));

cas.configure({
  casHost: "llavero.its.txstate.edu",   
  casPath: "/cas",                
  ssl: true,                        
  service: "http://localhost:3000", // your site
  sessionName: "cas_user",          // the cas user_name will be at req.session.cas_user (this is the default)
  renew: false,                     // true or false, false is the default
  redirectUrl: '/'            // the route that cas.blocker will send to if not authed. Defaults to '/'
});

//app.use(cas.bouncer);
/********************************************************************/

//routes
app.use('/stages', stages);
app.use('/categories', categories);
app.use('/users', users);
app.use('/ideas', ideas);
app.use('/votes', votes);
app.use('/comments', comments);

//this could be used to make it a single-page application.
//There would need to be some client side routing
app.get('*', function(req, res) {
    match({routes:clientRoutes.default, location: req.url}, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {
        // You can also check renderProps.components or renderProps.routes for
        // your "not found" component or route respectively, and send a 404 as
        // below, if you're using a catch-all route.
        var rendered = ReactDOMServer.renderToString(React.createElement(RouterContext, renderProps));
        res.status(200).render('index', {'app-content': rendered})
      } else {
        res.status(404).send('Not found') 
      }
    });
    
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
