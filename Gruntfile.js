/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    all: ['app/**/*.js']
  });

  // Default task.
  grunt.registerTask('default', 'build');
  grunt.registerTask('build', ['template:less', 'template:all', 'less', 'concat:jsvendor', 'concat:jswebsite', 'uglify:all', 'htmlmin', 'copy:all']);
};
