'use strict';

define(['app', 'baserouter'], function (app, BaseRouter) {

  var Router = BaseRouter.extend({

    // Denied Routes
    denied: ['professors/new'],

    // Routes
    appRoutes: {
      '': 'index',
      'professors': 'index',
      'professors/new': 'new',
      'professors/:id': 'details'
    },

    // Filter routes (for auth purposes)
    before: function (params, next) {
      var path    = Backbone.history.fragment,
          denied  = _.contains(this.denied, path);

      // Get session
      app.session.auth(function (session, user) {

        if (denied && !user.auth) {

          // Denied!
          app.trigger('message', {
            icon: 'glyphicon-ban-circle',
            message: 'Debes iniciar sesión para poder continuar'
          });
          
          // Redirect to home
          app.router.navigate('#/');

        } else {

          // Go head! yepa yepa yepa!!
          next();

        }

      });

    }

  });

  return Router;

});
