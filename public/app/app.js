'use strict';

define(['marionette'], function (Marionette) {

  var App = new Marionette.Application();

  // Regions
  App.addRegions({
    header  : '#header',
    main    : '#main',
    footer  : '#footer'
  });

  // After initialize
  App.on('initialize:after', function (options) {
    Backbone.history.start();

    // Messages
    App.bind('message', function (object) {
      var el = $('#message');
      el.find('.glyphicon').addClass(object.icon || 'glyphicon-info-sign');
      el.find('.message').html(object.message);
      el.find('.btn').html(object.button || 'Aceptar');
      el.modal({ show: true });
    });

    // Notifications
    App.bind('notify', function (options) {
      $('.notifications').notify(_.extend({
        closable: false,
        type: 'default',
        message: { text: 'Hecho.' }
      }, options)).show();
    });

    // Config language of moment.js
    moment.lang('es');

  });

  // Templates
  Marionette.Renderer.render = function (template, data) {
    if (!JST[template]) {
      throw "Template '" + template + "' not found!";
    }

    return JST[template](data);
  };

  // Helpers
  Marionette.View.prototype.templateHelpers = function () {
    return {
      markdown: function (str) {
        // Compile markdown syntax
        return markdown.toHTML(str);
      },
      getUser: function () {
        return App.session.get('user') || {};
      }
    };
  };

  // Rest API Version
  App.rest = 'api/1.0';

  return App;

});
