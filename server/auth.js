'use strict';

define(function () {

  var auth = function (req, res, next) {
    console.log('is auth?');
    if (req.isAuthenticated()) {
      next();
    } else {
      res.send({
        errors: [{ message: "Bad Authentication data" }]
      });
    }
  };

  return auth;

});
