var fs = require('fs')
  , gulp = require('gulp')
  , bower = require('gulp-bower')
  , browserify = require('gulp-browserify')
  , compass = require('gulp-compass')
  , gulpif = require('gulp-if')
  , minify = require('gulp-minify-css')
  , plumber = require('gulp-plumber')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify');

gulp.task('bower', function () {
  return bower();
});

gulp.task('browserify', ['bower'], function () {
  gulp.src('./client/config/app.js')
    .pipe(plumber())
    .pipe(browserify())
    .pipe(gulp.dest('./client/assets/js/'))
    .pipe(rename('app.min.js'))
    .pipe(uglify({ outSourceMap: true }))
    .pipe(gulp.dest('./client/assets/js/'));
});

gulp.task('compass', ['bower'], function () {
  gulp.src('./client/assets/scss/*.scss')
    .pipe(plumber())
    .pipe(compass({ sass: './client/assets/scss', css: './client/assets/css' }))
    .pipe(gulp.dest('./client/assets/css/'))
    .pipe(rename('main.min.css'))
    .pipe(minify({ keepSpecialComments: false }))
    .pipe(gulp.dest('./client/assets/css/'));
});

gulp.task('config', function () {
  gulp.src('./server/config/config.default.js')
    .pipe(gulpif(!fs.existsSync('./server/config/config.js'), rename('config.js')))
    .pipe(gulp.dest('./server/config/'));
});

gulp.task('watch', function () {
  gulp.watch(['./client/config/*.js', './client/app/**/*.js'], ['browserify']);
  gulp.watch(['./client/assets/scss/*.scss', './client/assets/scss/**/*.scss'], ['compass']);
});

gulp.task('default', ['bower', 'browserify', 'compass', 'config']);
