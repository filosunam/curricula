'use strict';

define([
  'app',
  'plupload'
], function (app, Plupload) {

  // Utilities Object
  var Utilities = {};

  // Pagination Controls View
  Utilities.Pagination = Marionette.ItemView.extend({
    template: 'partials/pagination',
    events: {
      'click .prev': 'gotoPrev',
      'click .next': 'gotoNext'
    },
    initialize: function () {
      this.collection.pager();
      this.listenTo(this.collection, 'reset', this.render);
    },
    gotoPrev: function (e) {
      e.preventDefault();

      // Go to previous page
      this.collection.prevPage();
    },
    gotoNext: function (e) {
      e.preventDefault();

      // Go to next page
      this.collection.nextPage();
    },
    serializeData: function () {
      // Send information to view
      return this.collection.info();
    }
  });

  // File Upload View
  Utilities.FileUploader = Marionette.ItemView.extend({
    template: 'partials/file-upload',
    uploader: null,
    options: {
      url: '/api/1.0/professors/upload'
    },
    ui: {
      message: '.message',
      browseButton: '#file-select',
      progressContainer: '.progress',
      progressBar: '.progress .progress-bar'
    },
    initialize: function () {
      this.options.url += '?_id=' + this.options.model.get('_id');
    },
    onRender: function () {
      this.ui.message.hide();
      this.ui.progressContainer.hide();
 
      var defaults = {
        runtimes: 'gears,html5,flash,silverlight,browserplus',
        browse_button: this.ui.browseButton.get(0),
        container: this.el,
        multi_selection: false,
        max_file_size: '5mb',
        filters : [{ title : "Archivos de imagen (jpg, png)", extensions: "jpg,jpeg,png" }],
        resize: { width: 300, height: 300, quality: 90, crop: true},
        unique_names: true,
        rename: true
      };
 
      this.uploader = new Plupload.Uploader(_.defaults(this.options, defaults));
 
      this.uploader.init();

      this.uploader.bind('FilesAdded', _.bind(this.filesAdded, this));
      this.uploader.bind('UploadProgress', _.bind(this.uploadProgress, this));
      this.uploader.bind('UploadComplete', _.bind(this.uploadComplete, this));
      this.uploader.bind('Error', _.bind(this.handleUploadErrors, this));
 
    },
 
    startUpload: function () {
      this.uploader.start();
      this.ui.progressContainer.show();
    },
 
    filesAdded: function (up, file) {
      this.startUpload();
    },
 
    uploadProgress: function (up, file) {
      this.ui.progressBar.width(file.percent + '%');
    },

    uploadComplete: function (up, file) {
      // TODO: Refresh image
    },
 
    handleUploadErrors: function (up, err) {
      switch (err.message) {
        case 'File extension error.':
          err.message = 'La extensión del archivo de imagen no es soportada.';
          break;
      }
      this.ui.message.show();
      this.ui.message.html(err.message + ' (<strong>' + (err.file ? err.file.name : "") + '</strong>)');
    }
  });

  return Utilities;

});
