'use strict';

define([
  'app',
  'paginator',
  'modules/professor.views',
  'modules/professor.filters'
], function (app, Paginator, Views, Filters) {

  // Professor Object
  var Professor = {
    url: app.rest + '/professors',
    Views: {}
  };

  // Professor Model
  Professor.Model = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: Professor.url,
    defaults: {
      firstname: null,
      lastname: null,
      genre: 'Masculino',
      degree: 'Licenciatura',
      rfc: null,
      birth: new Date(0),
      nationality: 'Mexicana',
      pride: null,
      since: new Date(0),
      avatar: 'images/null.png',
      adscription: 'División de Estudios Profesionales',
      college: null,
      appointment: {
        academic: 'Profesor'
      },
      curriculum: null,
      training: null,
      teaching: null,
      teaching_thesis: null,
      research: null,
      publishing: null,
      creations: null,
      encouragements: null,
      grants: null,
      awards: null,
      events: null,
      associations: null,
      administration: null,
      pun: false,
      rdunja: false,
      status: 'Activo',
      created_at: new Date(),
      updated_at: new Date()
    },
    initialize: function () {

      this.on("sync", function (model, response) {

        if (response.errors) {
          
          // Show error message
          app.trigger('message', {
            icon: 'glyphicon-exclamation-sign',
            message: '¡Ha ocurrido un error inesperado!'
          });

          // Redirect
          app.router.navigate('#/');

        } else {

          // Clear timer
          if (this.timer) {
            clearTimeout(this.timer);
          }

          // Set timer
          this.timer = setTimeout(function () {

            // Notify
            app.trigger('notify', {
              message: { text: 'Se ha actualizado correctamente' }
            });

          }, 750);

        }

      }, this);
    }
  });

  // Professor Collection
  Professor.Collection = Paginator.clientPager.extend({
    model: Professor.Model,
    paginator_core: {
      dataType: 'json',
      url: Professor.url
    },
    paginator_ui: {
      firstPage: 1,
      currentPage: 1,
      perPage: 12
    },
    search: '',
    sort: {
      field: 'lastname',
      direction: 'asc',
    },
    filters: {
      pun: '',
      rdunja: '',
      adscription: '',
      fulltime: '',
      course_definitiveness: '',
      course: ''
    },
    parse: function (results) {
      // Total records
      this.totalRecords = results.length;
      // Total pages
      this.totalPages = Math.ceil(this.totalRecords / this.perPage);

      return results;
    }
  });

  // Professor Views
  Professor.Views = _.extend(Professor.Views, Views);

  // Professor Filters
  Professor.Views = _.extend(Professor.Views, Filters);

  return Professor;

});
