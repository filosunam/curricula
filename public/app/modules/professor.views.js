'use strict';

define([
  'app',
  'modules/utilities'
], function (app, Utilities) {

  var Views = {};

  // Professor Item
  Views.Item = Marionette.ItemView.extend({
    template: 'professors/item'
  });

  // Professor List
  Views.List = Marionette.CollectionView.extend({
    itemView: Views.Item
  });

  // Professor Layout List
  Views.LayoutList = Marionette.Layout.extend({
    template: 'professors/list',
    regions: {
      list: '.list',
      pages: '.pages'
    },
    initialize: function () {

      // Sort by defaults
      this.collection.setSort(this.collection.sort.field, this.collection.sort.direction);

    },
    onRender: function () {

      // Show List
      this.list.show(new Views.List({
        collection: this.collection
      }));

      // Show Pages
      this.pages.show(new Utilities.Pagination({
        collection: this.collection
      }));

    }
  });

  // Professor Layout
  Views.Layout = Marionette.Layout.extend({
    template: 'professors/layout',
    regions: {
      details: '#details'
    },
    events: {
      'click .professor-view': 'view',
      'click .professor-edit': 'edit',
      'click .professor-destroy': 'destroy'
    },
    bindings: {
      '.bind-fullname': {
        observe: ['firstname', 'lastname'],
        onGet: function (values) {
          return (values[0] || '{nombre}') + ' ' + (values[1] || '{apellidos}');
        }
      },
      '.bind-rfc': 'rfc',
      '.bind-nationality': 'nationality',
      '.bind-adscription': 'adscription',
      '.bind-pride': {
        observe: ['appointment', 'pride'],
        updateMethod: 'html',
        onGet: function (values) {
          if (values[0].fulltime === true) {
            return values[1];
          }

          return '<span class="glyphicon glyphicon-ban-circle"></span> <em>No aplica</em>';
        }
      },
      '.bind-college': {
        observe: ['college', 'adscription'],
        updateMethod: 'html',
        onGet: function (values) {
          if ('División de Estudios Profesionales' === values[1]) {
            return values[0];
          }

          return '<span class="glyphicon glyphicon-ban-circle"></span> <em>No aplica</em>';
        }
      },
      '.bind-appointment': {
        observe: 'appointment',
        onGet: function (appointment) {
          var output = appointment.academic;

          if (appointment.category) { output += ' ' + appointment.category; }
          if (appointment.level) { output += ' ' + appointment.level; }
          if (appointment.fulltime) { output += ' TC'; }
          if (appointment.definitiveness) { output += ' Definitivo'; }

          return output;
        }
      },
      '.bind-status': 'status',
      '.bind-birth': {
        observe: 'birth',
        onGet: 'dateBinding'
      },
      '.bind-since': {
        observe: 'since',
        onGet: 'dateBinding'
      },
      '.bind-degree': {
        observe: ['degree', 'genre'],
        onGet: 'degreeBinding'
      },
      '.bind-pun': {
        observe: 'pun',
        updateMethod: 'html',
        onGet: function (pun) {
          if (pun) {
            return '<span class="label label-success">PUN</span>';
          }
        }
      },
      '.bind-rdunja': {
        observe: 'rdunja',
        updateMethod: 'html',
        onGet: function (rdunja) {
          if (rdunja) {
            return '<span class="label label-success">RDUNJA</span>';
          }
        }
      },
      '.bind-updated': {
        observe: 'updated_at',
        onGet: function (date) {
          return moment(date).fromNow();
        },
        initialize: function ($el, model, options) {
          // Auto refresh
          setInterval(function () {
            $el.html(moment(model.get('updated_at')).fromNow());
          }, 1000);
        }
      }
    },
    view: function () {

      // Show details
      this.details.show(new Views.Details({
        model: this.model,
        bindings: this.bindings
      }));

    },
    edit: function (e) {
      e.preventDefault();

      // Show edit form
      this.details.show(new Views.Edit({
        model: this.model,
        bindings: this.bindings
      }));

    },
    destroy: function (e) {
      e.preventDefault();

      if (confirm("¿Estás seguro?")) {
        // Destroy model
        this.model.destroy();
        app.router.navigate('#/');
      }

    },
    onRender: function () {

      // Show details
      this.view();

      // Data bindings
      this.stickit();

    },
    onShow: function () {

      // Scrollspy
      $('body').scrollspy({ target: '#navbar-curriculum' });

      // Affix elements
      $('[data-spy="affix"]').affix({
        offset: {
          top: function (e) {
            return e.attr("data-offset-top");
          },
          bottom: function (e) {
            return e.attr("data-offset-bottom");
          }
        }
      });

      // Smooth scrolling
      $(".affix-menu a[href^='#']").on('click', function (e) {

        e.preventDefault();
        var element = $(this.hash);

        if (element.length) {
          $('html, body').animate({
            scrollTop: element.offset().top
          }, 300);
        }

      });
    },
    dateBinding: function (date) {
      return moment(date).format('DD MMM YYYY') + ' (' + moment(date).fromNow(true) + ')';
    },
    degreeBinding: function (values) {

      var degree = values[0],
          genre  = values[1];

      switch (degree) {
        case 'Licenciatura':
          return 'Lic.';
        case 'Maestría':
          if (genre === 'Masculino') {
            return 'Mtro.';
          } else {
            return 'Mtra.';
          }
          break;
        case 'Doctorado':
          if (genre === 'Masculino') {
            return 'Dr.';
          } else {
            return 'Dra.';
          }
          break;
      }
    }
  });

  // Professor Details
  Views.Details = Marionette.ItemView.extend({
    template: 'professors/details',
    onRender: function () {
      
      // Data bindings
      this.stickit(this.options.model, this.options.bindings);

    }
  });

  // Professor Edit
  Views.Edit = Marionette.Layout.extend({
    template: 'professors/edit',
    regions: {
      fileuploader: '#fileuploader'
    },
    events: {
      'keyup input': 'updateField',
      'keyup textarea': 'updateField',
      'change input': 'updateField',
      'change textarea': 'updateField',
      'change .saveOnChange': 'updateField',
      'change [id^="birth-"]': 'updateDate',
      'change [id^="since-"]': 'updateDate',
      'change #pun': 'updateBoolean',
      'change #rdunja': 'updateBoolean',
      'change [id^="appointment-"]': 'updateAppointment',
      'change [type=checkbox][id^="appointment-"]': 'updateAppointmentBoolean'
    },
    updateDate: function (e) {

      var newDate, field;

      var select = $(e.currentTarget).attr('id'),
          value = parseInt($(e.currentTarget).val(), 10);

      switch (select) {
        case 'birth-day':
          field   = 'birth';
          newDate = moment(this.model.get(field)).date(value);
          break;
        case 'birth-month':
          field   = 'birth';
          newDate = moment(this.model.get(field)).month(value);
          break;
        case 'birth-year':
          field   = 'birth';
          newDate = moment(this.model.get(field)).year(value);
          break;
        case 'since-day':
          field   = 'since';
          newDate = moment(this.model.get(field)).date(value);
          break;
        case 'since-month':
          field   = 'since';
          newDate = moment(this.model.get(field)).month(value);
          break;
        case 'since-year':
          field   = 'since';
          newDate = moment(this.model.get(field)).year(value);
          break;
      }

      // Save model
      this.model.save(field, newDate);

    },
    updateField: function (e) {

      var field = $(e.currentTarget).attr('id'),
          value = $(e.currentTarget).val();

      // Save model
      this.model.save(field, value);

    },
    updateBoolean: function (e) {

      var field = $(e.currentTarget).attr('id'),
          value = $(e.currentTarget).is(':checked');

      // Save model
      this.model.save(field, value);

    },
    updateAppointment: function (e) {

      var field = $(e.currentTarget).attr('id'),
          value = $(e.currentTarget).val(),
          appointment = this.model.get('appointment');

      field = field.substr(field.indexOf("-", 0) + 1, field.length);
      appointment[field] = value;

      // Save model
      this.model.save('appointment', appointment);

    },
    updateAppointmentBoolean: function (e) {

      var field = $(e.currentTarget).attr('id'),
          value = $(e.currentTarget).is(':checked'),
          appointment = this.model.get('appointment');

      field = field.substr(field.indexOf("-", 0) + 1, field.length);
      appointment[field] = value;

      // Save model
      this.model.save(field, value);

    },
    onRender: function () {

      // File Uploader
      this.fileuploader.show(new Utilities.FileUploader({
        model: this.model
      }));
      
      // Data bindings
      this.stickit(this.options.model, this.options.bindings);

    }
  });

  return Views;

});
