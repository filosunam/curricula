'use strict';

module.exports = function (grunt) {
  
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    express: {
      options: {
        delay: 1000
      },
      dev: {
        options: {
          script: 'server.js'
        }
      },
      prod: {
        options: {
          script: 'server.js',
          background: false,
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'server.js',
          node_env: 'test'
        }
      }
    },

    watch: {
      express: {
        files: ['server.js', 'server/**/*.js'],
        tasks: ['express:dev'],
        options: { nospawn: true }
      },
      scripts: {
        files: ['**/*.js', '!**/node_modules/**', '!public/components/**'],
        tasks: ['jshint']
      },
      preprocess: {
        files: ['public/_index.ejs'],
        tasks: ['preprocess:dev']
      },
      jst: {
        files: ['public/templates/**/*.html'],
        tasks: ['jst']
      },
      livereload: {
        options: { livereload: true },
        files: [
          'server/**/*',
          'public/**/*',
          '!public/uploads/**/*',
          '!public/templates/**/*',
          '!public/components/**'
        ]
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: 'public/app',
          name: 'main',
          mainConfigFile: 'public/app/main.js',
          out: 'public/js/app.js'
        }
      }
    },

    jst: {
      compile: {
        options: {
          processName: function (filename) {
            filename = filename.replace(/public\/templates\//, '');
            filename = filename.replace('.html', '');

            return filename;
          }
        },
        files: {
          "public/js/templates.js": ["public/templates/**/*.html"]
        }
      }
    },

    preprocess : {
      options: {
        context : { DEBUG: true }
      },
      dev: {
        src: 'public/_index.ejs',
        dest: 'public/index.ejs',
        options: {
          context: {
            script: 'app/main',
            node_env: 'development'
          }
        }
      },
      prod: {
        src: 'public/_index.ejs',
        dest: 'public/index.ejs',
        options: {
          context: {
            script: 'js/app',
            node_env: 'production'
          }
        }
      }
    },

    jshint: {
      options: { jshintrc: '.jshintrc' },
      testing: ['test/**/*.js'],
      backend: ['Gruntfile.js', 'server/**/*.js'],
      frontend: {
        options: {
          globals: { requirejs: true }
        },
        files: {
          src: ['public/app/**/*.js']
        }
      }
    },

    release: {
      options: {
        commit: false,
        push: false,
        pushTags: false,
        npm: false,
        commitMessage: 'Release <%= version %>',
        tagMessage: 'Version <%= version %>'
      }
    }

  });

  grunt.registerTask('server', function (target) {
    
    if (target === 'test') {
      grunt.log.subhead('Test mode tasks');
      grunt.task.run(['preprocess:prod', 'express:test', 'nodeunit']);
    }

    if (target === 'production') {
      grunt.log.subhead('Production mode tasks');
      grunt.task.run(['preprocess:prod', 'express:prod']);
    }

    if (target === 'development' || !target) {
      grunt.log.subhead('Development mode tasks');
      grunt.task.run(['preprocess:dev', 'express:dev', 'watch']);
    }

  });

  grunt.registerTask('build', ['preprocess:prod', 'jst', 'requirejs']);

};
