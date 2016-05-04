'use strict';


var gulp = require('gulp'),
  exit = require('gulp-exit'),
  mocha = require('gulp-mocha'),
  shell = require('gulp-shell'),
  models = require('./server/models'),
  nodemon = require('gulp-nodemon'),
  istanbul = require('gulp-istanbul');

var paths = {
  serverTest: './test/server/**/*.js'
};

gulp.task('coverage-setup', function () {
  return gulp.src('./server/**/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('db:migrate', shell.task([
  'node_modules/.bin/sequelize db:migrate'
]));

gulp.task('db:sync', function () {
  return models.sequelize.sync().then(exit());
});

gulp.task('server:test', ['db:sync', 'coverage-setup'], function () {
  return gulp.src(paths.serverTest)
    .pipe(mocha)
    .pip(istanbul.writeReports({
      dir: './test/coverage'
    }));
});

gulp.task('nodemon', function () {
  nodemon({ script: 'server.js', ext: 'js', ignore: ['./node_modules/**'] })
    .on('restart', function () {
      console.log('>> node restart');
    });
});

gulp.task('default', ['nodemon']);
gulp.task('test', ['server:test']);
gulp.task('build', ['db:migrate']);

gulp.task('heroku:staging', ['build']);
gulp.task('heroku:production', ['build']);
