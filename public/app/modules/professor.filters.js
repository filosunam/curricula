'use strict';

define([
  'app'
], function (app) {

  var Views = {};

  // Controls View
  Views.Controls = Marionette.Layout.extend({
    template: 'controls/index',
    regions: {
      search: '#search',
      sort: '#sort',
      filters: '#filters'
    },
    onRender: function () {

      // Show search form
      this.search.show(new Views.Search({
        collection: this.collection
      }));

      // Show sort form
      this.sort.show(new Views.Sort({
        collection: this.collection
      }));

      // Show filters form
      this.filters.show(new Views.Filters({
        collection: this.collection
      }));
    }
  });

  // Search View
  Views.Search = Marionette.ItemView.extend({
    template: 'controls/search',
    events: {
      'keyup input': 'search'
    },
    search: function (e) {
      var collection = this.collection;

      // Clear timer
      if (this.timer) {
        clearTimeout(this.timer);
      }

      // Set timer
      this.timer = setTimeout(function () {

        collection.search = $(e.currentTarget).val();
        collection.setFilter([
          'firstname',
          'lastname',
          'adscription',
          'college'
        ], collection.search);

      }, 500);
      
    },
    serializeData: function () {
      // Send information to view
      return this.collection;
    }
  });

  // Sort View
  Views.Sort = Marionette.ItemView.extend({
    template: 'controls/sort',
    events: {
      'change select': 'sort'
    },
    sort: function (e) {
      e.preventDefault();

      var sort = $(e.currentTarget).val();
      
      switch (sort) {
        case 'since':
          this.collection.sort.field = sort;
          this.collection.sort.direction = 'desc';
          break;
        case 'lastname':
          this.collection.sort.field = sort;
          this.collection.sort.direction = 'asc';
          break;
        default:
          this.collection.sort.field = 'lastname';
          this.collection.sort.direction = 'asc';
          break;
      }

      this.collection.setSort(this.collection.sort.field, this.collection.sort.direction);

    },
    serializeData: function () {
      // Send information to view
      return this.collection;
    }
  });

  // Filters View
  Views.Filters = Marionette.ItemView.extend({
    template: 'controls/filters',
    events: {
      'click [type="checkbox"]': 'filter'
    },
    filter: function (e) {
      var input = $(e.currentTarget),
          field = input.attr('id'),
          value = input.is(':checked') ? input.val() : '';

      var rules = [];

      switch (field) {
        case 'pun':
        case 'rdunja':
          this.collection.filters[field] = 'true' === value ? true : '';
          break;
        case 'adscription_1':
        case 'adscription_2':
        case 'adscription_3':
          this.collection.filters.adscription = value;
          break;
        case 'fulltime':
          this.collection.filters.fulltime = 'true' === value ? true : '';
          break;
        case 'course_definitiveness':
          this.collection.filters.course_definitiveness = 'true' === value ? true : '';
          break;
        case 'course':
          this.collection.filters.course = 'true' === value ? true : '';
          break;
      }

      _.each(this.collection.filters, function (value, field) {

        if (value) {
          switch (field) {
            case 'fulltime':
              rules.push({ field: 'appointment', type: 'function', value: function (f) {
                if (f.academic === 'Profesor' && f.fulltime === true) {
                  return true;
                }
                
                return false;
              }});
              break;
            case 'course_definitiveness':
              rules.push({ field: 'appointment', type: 'function', value: function (f) {
                if (f.academic === 'Profesor' && f.definitiveness === true && f.fulltime === false) {
                  return true;
                }
                
                return false;
              }});
              break;
            case 'course':
              rules.push({ field: 'appointment', type: 'function', value: function (f) {
                if (f.academic === 'Profesor' && f.definitiveness === false && f.fulltime === false) {
                  return true;
                }
                
                return false;
              }});
              break;
            default:
              rules.push({ field: field, type: 'equalTo', value: value });
          }
        }

      });

      this.collection.setFieldFilter(rules);
      this.collection.pager();


      if (input.is(':checked')) {
        input.parent().removeClass('checkbox-disabled');
      } else {
        input.parent().addClass('checkbox-disabled');
      }

    },
    serializeData: function () {
      // Send information to view
      return this.collection;
    }
  });

  return Views;

});
