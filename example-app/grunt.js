/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

module.exports = function(grunt) {

  var _ = require('underscore');
  var path = require('path');

  // Project configuration.
  grunt.initConfig({

    requirejs: {
      compile: {
        options: {
          mainConfigFile: "app/js/app.js",
          out: "dist/release/js/app.js",
          name: "app"
        }
      }
    },

    clean: {
      dist: [
        'dist/*'
      ]
    }

  });

  grunt.loadNpmTasks('grunt-contrib');

  grunt.registerTask('build', 'requirejs');
  grunt.registerTask('default', 'clean build');

};

