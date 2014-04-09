'use strict';

define([
  'app',
  'modules/session'
], function (app, Session) {

  var Layout = {};

  // Controls Layout
  Layout.Controls = Marionette.Layout.extend({
    template: 'controls',
    regions: {
      controls: '#controls',
      professors: '#professors'
    }
  });
  
  // Header Layout
  Layout.Header = Marionette.Layout.extend({
    template: 'header',
    regions: { panel: '#panel' },
    initialize: function () {
      this.listenTo(app.session, {
        'change:auth': this.render
      });
    },
    onRender: function () {

      if (app.session.get('auth')) {
        // Show panel if the user are currently logged
        this.panel.show(new Session.Views.Logout({ model: app.session }));
      } else {
        // Show form if the user isn't logged
        this.panel.show(new Session.Views.Login({ model: app.session }));
      }

    }
  });

  // Footer Layout
  Layout.Footer = Marionette.Layout.extend({
    template: 'footer'
  });

  return Layout;

});
