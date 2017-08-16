const Home = require('./models/Home');

const crypter = require('./lib/Crypter');

var MiddlewareBag = {};

// Logged In middleware
MiddlewareBag.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  
  res.redirect('/');
}

// Guest Middleware
MiddlewareBag.guest = function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/dashboard');
  }
}

MiddlewareBag.isTokenValid = function(req, res, next) {
  if(req.query.token) {
    var homeDetails = JSON.parse(crypter.decrypt(req.query.token));
    Home.findById(homeDetails.homeId).then((home) => {
      if(home) {
        req.home = home;
        return next();
      } else {
        res.status(401).send("Invalid Token");
      }
    });
  } else {
    res.status(400).send("Token not found");
  }
}

module.exports = MiddlewareBag;