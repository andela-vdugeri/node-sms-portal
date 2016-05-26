'use strict';


var gulp = require('gulp'),
  exit = require('gulp-exit'),
  mocha = require('gulp-mocha'),
  shell = require('gulp-shell'),
  models = require('./server/models'),
  nodemon = require('gulp-nodemon'),
  logger = require('winston'),
  jade = require('gulp-jade'),
  less = require('gulp-less'),
  path = require('path'),
  concat = require('gulp-concat'),
  browserify = require('browserify'),
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream'),
  bower = require('gulp-bower'),
  uglify = require('gulp-uglify'),
  istanbul = require('gulp-istanbul');

var paths = {
  public: 'public/**',
  jade: 'app/**/*.jade',
  styles: 'app/styles/*.+(less|css)',
  scripts: 'app/**/*.js',
  staticFiles: [
    '!app/**/*.+(less|css|js|jade)',
    'app/**/*.*'
  ],
  serverTest: './test/server/**/*.js'
};

gulp.task('jade', function () {
  gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('./poblic/'));
});

gulp.task('less', function () {
  gulp.src(paths.styles)
    .pipe(less({
      paths: [path.join(__dirname, 'styles')]
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('static-files', function () {
  return gulp.src(paths.staticFiles)
    .pipe(gulp.dest('public/'));
});

gulp.task('scripts', function () {
  gulp.src(paths.scripts)
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('browserify', function () {
  var b = browserify();
  b.add('./app/application.js');
  return b.bundle()
  .on('success', gutil.log.bind(gutil, 'Browserify Rebundled'))
  .on('error', gutil.log.bind(gutil, 'Browserify Error: in browserify gulp task'))
  .pipe(source('index.js'))
  .pipe(gulp.dest('./public/js'));
});

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
  process.env.NODE_ENV = 'test';
  return gulp.src(paths.serverTest)
    .pipe(mocha())
    .pipe(istanbul.writeReports({
      dir: './test/coverage'
    }));
});

gulp.task('minify-js', ['browserify'], function () {
  return gulp.src('./public/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function () {
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.styles, ['less']);
  gulp.watch(paths.scripts, ['browserify']);
});

gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest('public/lib/'));
});

gulp.task('nodemon', function () {
  nodemon({ script: 'server.js', ext: 'js', ignore: ['./node_modules/**'] })
    .on('restart', function () {
      logger.info('>> node restart');
    });
});

gulp.task('default', ['nodemon', 'browserify', 'build', 'watch']);
gulp.task('test', ['server:test']);
gulp.task('build', ['db:migrate', 'bower', 'jade', 'less', 'static-files']);

gulp.task('heroku:staging', ['build', 'browserify']);
gulp.task('heroku:production', ['build', 'minify-js']);
