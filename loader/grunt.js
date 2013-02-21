module.exports = function(grunt) {

  var config = require('js/config');

  grunt.initConfig({

    requirejs: {
      compile: {
        options: {
          namespace : config.namespace,
          baseUrl   : "./js",
          name      : "main",
          out       : "dist/main.js",
          // We minify the whole thing in the end instead
          optimize  : "none"
        }
      }
    },

    concat: {
      'dist': {
        src: [ 'js/config.js', 'dist/main.min.js' ],
        dest: 'dist/widget.load.v1.default.js'
      },
      'debug': {
        src: [ 'js/config.js', 'vendor/require.js', 'js/require.js', 'dist/main.js' ],
        dest: 'dist/widget.load.v1.default.js'
      }
    },

    min: {
      'dist': {
        src: [ 'vendor/require.js', 'js/require.js', 'dist/main.js' ],
        dest: 'dist/main.min.js'
      }
    },

    clean: {
      pre: [ 'dist' ],
      post: [ 'dist/main.js', 'dist/main.min.js' ]
    }

  });

  grunt.registerTask('wrap', 'Wraps source files with specified header and footer', function() {

    // FIXME: DRY up - this path's repeated in three places.
    var path = 'dist/widget.load.v1.default.js',
        before = '(function() {\n',
        after = '\n}());',
        content = grunt.file.read(path);

    grunt.file.write(path, before + content + after);

    grunt.log.writeln('Wrapped "' + path + '" in an IIFE');

  });

  grunt.registerTask('build', 'requirejs min concat:dist');

  grunt.registerTask('default', 'clean:pre build clean:post wrap');
  grunt.registerTask('debug', 'clean:pre requirejs concat:debug clean:post wrap');

  grunt.loadNpmTasks('grunt-contrib');

};
