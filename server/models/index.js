'use strict';

define([
  'auth',
  'fs',
  'models/user',
  'models/professor'
], function (auth, fs, User, Professor) {

  // Set default methods
  User.methods(['get', 'post', 'put', 'delete']);
  Professor.methods(['get', 'post', 'put', 'delete']);

  // Users permissions (all denied)
  ['get', 'post', 'put', 'delete'].forEach(function (method) {
    User.before(method, auth);
  });

  // Professor permissions (only read)
  ['post', 'put', 'delete'].forEach(function (method) {
    Professor.before(method, auth);
  });

  // Set created_at before updating professor
  Professor.before('post', function (req, res, next) {
    req.body.created_at = new Date();
    req.body.updated_at = new Date();
    next();
  });

  // Set updated_at before creating professor
  Professor.before('put', function (req, res, next) {
    req.body.updated_at = new Date();

    next();
  });

  // Route for upload professor image
  Professor.route('upload.post', function (req, res, next) {
    if (req.isAuthenticated()) {

      req.quer.where('_id').equals(req.query._id).exec(function (err, professor) {
        professor = professor[0];
        if (professor) {

          // On begin
          res.locals.upload.on('begin', function (file) {
            var match = file.name.match(/^([\w\s\/]*?)([\w\s\.]*)\.(\w+)$/);

            if (professor._id.toString() === match[2]) {
              deleteImage(err, professor);
            }

            file.name = professor._id + '.' + match[3];
            
          });

          // On end
          res.locals.upload.on('end', function (file) {
            var match = file.name.match(/^([\w\s\/]*?)([\w\s\.]*)\.(\w+)$/);
            if (professor._id.toString() === match[2]) {
              professor.avatar = '/uploads/' + file.name;
              professor.save();
            }
          });

          // File Handler
          res.locals.upload.fileHandler()(req, res, next);
        }
      });

    } else {
      res.send({
        errors: [{ message: "Bad Authentication data" }]
      });
    }
  });

  // Clear image if the user has been deleted or the image has been updated
  Professor.before('delete', function (req, res, next) {
    // Delete image
    req.quer.where('_id').equals(req.params.id).exec(deleteImage);

    next();
  });

  // Generate hash if the user is created or the password is updated
  User.before('post', User.hash_password)
      .before('put', User.hash_password);

  // Delete image callback
  function deleteImage(err, professor) {
    if (professor.avatar !== '/images/null.png') {
      var image = './public' + professor.avatar;
      fs.exists(image, function (exists) {
        if (exists) {
          fs.unlink(image);
        }
      });
    }
  }

  return [User, Professor];

});
