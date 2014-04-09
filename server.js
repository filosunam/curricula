'use strict';

var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require,
  baseUrl: __dirname + '/server'
});

requirejs([
  'conf',
  'express',
  'models/index',
  'auth',
  'connections/passport',
  'connections/local',
  'jquery-file-upload-middleware'
], function (conf, express, models, auth, passport, localStrategy, upload) {

  var server  = module.exports = express(),
      listen  = server.listen(process.env.PORT || conf.port),
      Session = require('connect-mongo')(express);

  // Local auth
  passport.use(localStrategy);

  // Configure upload middleware
  upload.configure({
    uploadDir: __dirname + '/public/uploads',
    uploadUrl: '/upload'
  });

  // All environments
  server.configure(function () {
    server.use(express.query());
    server.use(express.json());
    server.use(express.urlencoded());
    server.use(express.cookieParser());
    server.use(express.methodOverride());

    // Locals
    server.use(function(req, res, next) {
      res.locals.upload = upload;

      next();
    });

    // Compile less files
    server.use(require('less-middleware')({
      src: __dirname + '/public',
      yuicompress: true
    }));

    // Set view engine for main file
    server.set("view engine", "ejs");
    server.set('views', __dirname + '/public');

    // Static files
    server.use(express.static(__dirname + '/public'));
  });

  // Development
  server.configure('development', function () {
    // Sessions
    server.use(express.session({
      secret: conf.session.secret,
      cookie: { maxAge: conf.session.maxAge }
    }));

    // Passport
    server.use(passport.initialize());
    server.use(passport.session());

    // Logger
    server.use(express.logger('dev'));
    server.use(express.errorHandler());

    // Disable cache
    server.disable('view cache');
  });

  // Production
  server.configure('production', function () {
    // Sessions
    server.use(express.session({
      secret: conf.session.secret,
      cookie: { maxAge: conf.session.maxAge },
      store: new Session({ url: conf.mongo.url })
    }));

    // Passport
    server.use(passport.initialize());
    server.use(passport.session());

    // Logger
    server.use(express.logger());

    // Enable cache
    server.enable('view cache');

    // Csrf token
    server.use(express.csrf());
    server.use(function (req, res, next) {
      var csrf = req.csrfToken();
      res.setHeader('X-CSRF-Token', csrf);
      res.locals.csrf = csrf;
      next();
    });
  });

  // Router
  server.use(server.router);
  
  // Main route
  server.get('/', function (req, res) {
    res.render('index');
  });

  // Get session
  server.get("/session", function (req, res) {
    if (req.isAuthenticated()) {
      res.send({
        auth: true,
        user: req.user
      });
    } else {
      res.send({
        auth: false
      });
    }
  });

  // Login
  server.post('/session', passport.authenticate('local'), function (req, res) {
    res.send({
      auth: true,
      user: req.user
    });
  });

  // Logout
  server.del('/session', function (req, res) {
    req.logout();
    res.send({
      auth: false,
      csrf: 'development' === server.get('env') ? null : req.csrfToken()
    });
  });

  // Rest API
  models.forEach(function (model) {
    model.register(server, conf.api + model.slug || model.modelName);
  });

});
