var fs = require('fs')
  , gulp = require('gulp')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify');

gulp.task('requirejs', function () {
  gulp.src('./client/assets/lib/requirejs/require.js')
    .pipe(rename('require.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./client/assets/lib/requirejs/'));
});

gulp.task('config', function () {
  if (!fs.existsSync('./server/config/config.js')) {
    gulp.src('./server/config/config.default.js')
      .pipe(rename('config.js'))
      .pipe(gulp.dest('./server/config/'));
  }
});

gulp.task('default', function () {
  gulp.run('requirejs', 'config');
});
