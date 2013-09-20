/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-regarde');

  grunt.loadNpmTasks('grunt-gh-pages');



  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    all: ['app/**/*.js'],
    concat: {
      options: {
        separator: ';'
      },
      js: {
        src: [
          'src/slidedeck-pdf.js',
          'src/bower_components/history.js/scripts/bundled/html5/jquery.history.js'
          ],
        dest: 'tmp/slidedeck-pdf.js'
      },
    },
    copy: {
      'build': {
        files: [
          {src: ['tmp/slidedeck-pdf.js'], dest: 'build/slidedeck-pdf.js'}
        ]
      },
      'example': {
        files: [
          {src: ['src/bower_components/jquery/jquery.js'], dest: 'example/js/jquery.js'},
          {src: ['src/bower_components/Swipe/swipe.js'], dest: 'example/js/swipe.js'},
          {src: ['vendor/pdf.js/build/generic/build/pdf.js'], dest: 'example/js/pdf.js'},
          {src: ['vendor/pdf.js/build/generic/build/pdf.worker.js'], dest: 'example/js/pdf.worker.js'},
          {src: ['src/bower_components/markdown/lib/markdown.js'], dest: 'example/js/markdown.js'},
          {src: ['build/slidedeck-pdf.js'], dest: 'example/js/slidedeck-pdf.js'}
        ]
      }
    },
    /**
    * Live-Reload
    */
    reload: {
      port: 35729, // LR default
      liveReload: {}
    },
    regarde: {
      all: {
        files:['src/**/*'],
        tasks:['build:example', 'livereload']
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'src/*.js']
    },

    /**
    * gh-pages
    */
    'gh-pages': {
      options: {
        base: 'example'
      },
      src: ['**']
    }
  });

  grunt.registerTask('default', 'build');

  grunt.registerTask('watch', ['livereload-start', 'build:eaxmple', 'regarde']);
  grunt.registerTask('build', ['concat:js', 'copy:build']);
  grunt.registerTask('build:example', ['build', 'copy:example']);
};
