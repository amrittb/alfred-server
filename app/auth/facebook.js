var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/User');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user) {
    done(null, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: process.env.FB_LOGIN_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'gender']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("Profile", profile);
    User.findOrCreate({
      where: {
        id: profile.id
      }
    }).spread(function(user, created) {
      if (created) {
        // If just created update database.
        user.displayName = profile.displayName;
        user.profilePictureUrl = (profile.photos.length > 0)?(profile.photos[0].value):null;
        user.gender = profile.gender;
        user.save().then(function() {
          return cb(null, user);
        });
      } else {
        return cb(null, user);
      }
    });
  }
));

module.exports = passport;