var fs = require('fs')
  , gulp = require('gulp')
  , browserify = require('gulp-browserify')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify');

gulp.task('browserify', function () {
  gulp.src('./client/config/app.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('./client/assets/js/'))
});

gulp.task('config', function () {
  if (!fs.existsSync('./server/config/config.js')) {
    gulp.src('./server/config/config.default.js')
      .pipe(rename('config.js'))
      .pipe(gulp.dest('./server/config/'));
  }
});

gulp.task('watch', function () {
  gulp.watch(['./client/config/*.js', './client/app/*.js'], function () {
    gulp.run('browserify');
  });
});

gulp.task('default', function () {
  gulp.run('config', 'browserify');
});
