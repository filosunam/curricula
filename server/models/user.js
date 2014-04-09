'use strict';

define(['node-restful', 'db', 'crypto'], function (restful, db, crypto) {

  var schema = db.Schema({
    role: {
      type: String,
      required: true,
      default: "Waiting" // [Waiting, Viewer, Administrator]
    },
    firstname: String,
    lastname: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    created_at: Date,
    updated_at: Date,
    lastaccess: Date
  });

  var User = restful.model('user', schema);

  User.slug = 'users';

  User.login = function (data, callback) {
    var sha = crypto.createHash('sha256');
    sha.update(data.password);
    User.findOne({
      email: data.email,
      password: sha.digest('hex')
    }, function (err, user) {
      if (!user) {
        callback(err, null);
      } else {
        callback(null, user || null);
        
        user.lastaccess = new Date();
        user.save();
      }
    });
  };

  User.hash_password = function (req, res, next) {
    if (req.body.password.length !== 64) {
      var sha = crypto.createHash('sha256');
      sha.update(req.body.password);
      req.body.password = sha.digest('hex');
    }
    
    next();
  };


  return User;

});
