'use strict';

define(['models/user', 'passport-local'], function (User, LocalStrategy) {

  var localStrategy = new LocalStrategy.Strategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function (email, password, done) {

      User.login({
        email: email,
        password: password
      }, function (err, user) {
        if (user) {
          return done(null, user);
        }
        
        return done(null, false);
      });

    }
  );

  return localStrategy;

});
