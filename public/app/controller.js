'use strict';

define([
  'app',
  'layout',
  'modules/session',
  'modules/professor'
], function (app, Layout, Session, Professor) {

  // Initializer
  app.addInitializer(function () {

    // Set session model
    app.session = new Session.Model();

    // Set Collections
    app.collections = {
      professors: new Professor.Collection()
    };

    // Set Layout Object
    app.layout = {};

    // Set Controls Layout
    app.layout.controls = new Layout.Controls();

    // Set Header Layout
    app.layout.header = new Layout.Header();

    // Set Footer Layout
    app.layout.footer = new Layout.Footer();

  });

  // Controller
  var Controller = Marionette.Controller.extend({

    initialize: function () {

      // Show header
      app.header.show(app.layout.header);

      // Show footer
      app.footer.show(app.layout.footer);

    },

    // Search Professors
    index: function () {

      // Show Search Layout
      app.main.show(app.layout.controls);

      // Fetch collection
      app.collections.professors.fetch({
        silent: true,
        success: function (collection) {

          // Show Controls
          app.layout.controls.controls.show(new Professor.Views.Controls({
            collection: app.collections.professors
          }));

          // Show professors
          app.layout.controls.professors.show(new Professor.Views.LayoutList({
            collection: app.collections.professors
          }));

        }
      });

    },

    // Professor Details
    details: function (id) {

      app.collections.professors.fetch({
        silent: true,
        success: function (collection) {

          // Show Professor Layout
          app.main.show(new Professor.Views.Layout({
            model: collection.get(id)
          }));

        }
      });

    },

    // Professor New
    new: function () {

      var professor = new Professor.Model();
      professor.save({}, {
        success: function () {
          app.router.navigate('#/professors/' + professor.get('_id'));
        }
      });

    },
    
  });

  return Controller;

});
