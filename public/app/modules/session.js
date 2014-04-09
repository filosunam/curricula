'use strict';

define(['app'], function (app) {

  // Session Object
  var Session = {
    url: '/session',
    Views: {}
  };

  // Session Model
  Session.Model = Backbone.Model.extend({
    idAttribute: 'user',
    url: Session.url,
    login: function (credentials) {
      this.save(credentials, {
        success: function (user) {
          // Redirect to home
          app.router.navigate('#/');
        },
        error: function () {
          // Show error message
          app.trigger('message', {
            icon: 'glyphicon-ban-circle',
            message: 'No es posible iniciar sesión. Verifica tus datos.'
          });
          
          // Redirect to home
          app.router.navigate('#/');
        }
      });
    },
    logout: function () {
      var that = this;
      this.destroy({
        success: function (model, resp) {
          model.clear();
          model.id = null;

          // Refresh Csrf Token
          app.csrf = resp.csrf;
          // Refresh model
          that.set({ auth: false, user: null });
          // Redirect to home
          app.router.navigate('#/');
        }
      });
    },
    auth: function (callback) {
      this.fetch({ success: callback });
    }
  });

  // Session View Login
  Session.Views.Login = Marionette.ItemView.extend({
    template: 'users/login',
    events: {
      'submit form': 'login'
    },
    login: function (e) {
      e.preventDefault();

      this.model.login({
        email: $(this.el).find('#email').val(),
        password: $(this.el).find('#password').val()
      });
    }
  });

  // Session View Logout
  Session.Views.Logout = Marionette.ItemView.extend({
    template: 'users/logout',
    events: {
      'click .logout': 'logout'
    },
    logout: function (e) {
      e.preventDefault();

      this.model.logout();
    }
  });

  return Session;

});
