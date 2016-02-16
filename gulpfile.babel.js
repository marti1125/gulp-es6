'use strict';

import gulp from 'gulp';

gulp.task('default', () => {
  return gulp.src("test.html")
    .pipe(gulp.dest("dist"));
});
