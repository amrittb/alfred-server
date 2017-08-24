var express = require('express');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var session = require('express-session');
var passport = require('passport');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// Serving static files
app.use(express.static('public'));

var Database = require('./app/database/Database');

Database.getInstance().authenticate()
  .then(function() {
    console.log("Connection created");

    const migrator = require("./app/database/migrator");
  
    migrator.syncDatabase();
  })
  .catch(function(err) {
    console.error("Unable to connect to the database", err);
  });

// Login
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Nunjucks setup
nunjucks.configure('views', {
  autoescape: true,
  noCache: true,
  express: app
});

app.use(require('./app/routes.js'));


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
