'use strict';

requirejs.config({
  baseUrl: 'app/',
  paths: {
    templates     : '../js/templates',
    jquery        : '../components/jquery/dist/jquery.min',
    bootstrap     : '../components/bootstrap/dist/js/bootstrap.min',
    underscore    : '../components/underscore/underscore',
    backbone      : '../components/backbone/backbone',
    marionette    : '../components/backbone.marionette/lib/backbone.marionette.min',
    paginator     : '../components/backbone.paginator/lib/backbone.paginator',
    markdown      : '../components/markdown/lib/markdown',
    notify        : '../components/bootstrap.notify/js/bootstrap-notify',
    moment        : '../components/moment/min/moment-with-langs.min',
    stickit       : '../components/backbone.stickit/backbone.stickit',
    plupload      : '../components/plupload/js/plupload.full.min'
  },
  shim: {
    app: ['marionette', 'bootstrap'],
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    marionette: {
      deps: [
        'backbone',
        'templates',
        'markdown',
        'notify',
        'moment',
        'stickit'
      ],
      exports: 'Marionette'
    },
    notify: ['jquery'],
    stickit: ['backbone'],
    plupload: {
      exports: "plupload"
    },
    paginator: {
      deps: ['backbone'],
      exports: 'Backbone.Paginator'
    },
    markdown: { exports: 'markdown' },
    bootstrap: ['jquery']
  }
});

require([
  'app',
  'router',
  'controller'
], function (app, Router, Controller) {

  // Initializer
  app.addInitializer(function () {

    // Router
    app.router = new Router({
      // Controller
      controller: new Controller()
    });

    // Cross Domain
    app.csrf = $("meta[name='csrf-token']").attr("content");
    Backbone.sync = (function (original) {
      return function (method, model, options) {
        options.beforeSend = function (xhr) {
          xhr.setRequestHeader('X-CSRF-Token', app.csrf);
        };
        original(method, model, options);
      };
    })(Backbone.sync);

  });

  // Start
  app.start({
    root: window.location.pathname,
    path_root: '/'
  });

});
