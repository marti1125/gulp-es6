'use strict';

import gulp from 'gulp';
import runSequence from 'run-sequence';
import gutil from 'gulp-util';
import jade from 'gulp-jade';
import sass from 'gulp-sass';
import merge from 'merge-stream';
import express from 'express';
import browserSync from 'browser-sync';
import del from 'del';

var paths = {
  public: './public/',
  assets: 'assets/**/*.*',
  sass: './src/sass/app.sass',
  jade: './src/jade/*.jade'
};

var server;

function reload() {
  if (server) {
    return browserSync.reload({ stream: true });
  }
  return gutil.noop();
}

gulp.task('clean', () => {
  return del(paths.public);
});

gulp.task('assets', () => {
  return gulp.src(paths.assets)
         .pipe(gulp.dest(paths.public))
         .pipe(reload());
});

gulp.task('styles', () => {
  return gulp.src(paths.sass)
         .pipe(sass().on('error', sass.logError))
         .pipe(gulp.dest(paths.public))
         .pipe(reload());
});

gulp.task('html', () => {
  return gulp.src(paths.jade)
         .pipe(jade({pretty: true}))
         .pipe(gulp.dest(paths.public))
         .pipe(reload());
});

gulp.task('server', () => {
  server = express();
  server.use(express.static(paths.public));
  server.listen(3000);
  browserSync({ proxy: 'localhost:3000' });
});

gulp.task('build', (cb) => {
  runSequence('clean',['assets','styles','html'], cb);
});

gulp.task('watch', () => {
  gulp.watch(paths.sass, ['styles']);
  gulp.watch(paths.jade, ['html']);
  gulp.watch(paths.assets, ['assets']);
});

gulp.task('default', ['build', 'watch', 'server']);
