'use strict';

define(['models/user', 'passport'], function (User, passport) {
  
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      if (user) {
        done(null, user);
      }
    });
  });

  return passport;

});
