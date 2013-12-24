
module.exports = function(grunt) {

  var bowerPath = grunt.file.readJSON('.bowerrc').directory;

  /** Project configuration */
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      install: {
        options: {
          targetDir: bowerPath,
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! RequireJS 2.1.9 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved. Minified for brewGet: <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: bowerPath + '/requirejs/require.js',
        dest: bowerPath + '/requirejs/require.min.js'
      }
    }
  });

  /** Load the plugin that provides the "uglify" task */
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  /** Default tasks */
  grunt.registerTask('default', ['bower', 'uglify']);

};
