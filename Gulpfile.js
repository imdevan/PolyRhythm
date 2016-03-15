'use strict'

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	nodemon = require('gulp-nodemon'),
    eslint = require('gulp-eslint'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer');

browserSync = browserSync.create();

// HTML
gulp.task('html', function() {
  gulp.src('source/**/*.html')
    .pipe(gulp.dest('public/'))
    .pipe(browserSync.stream());
})

gulp.task('html:watch', function () {
  gulp.watch('source/**/*.html', ['html']);
});

// SASS
gulp.task('sass', function () {
  return gulp.src('source/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});

gulp.task('sass:watch', function () {
  gulp.watch('source/sass/**/*.scss', ['sass']);
});

// SCRIPTS
gulp.task('scripts', function() {
  return gulp.src([
          'source/js/**/*.js',
          '!source/js/draft/*.js'
      ])
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .pipe(browserSync.stream());
});

gulp.task('scripts:watch', function () {
  gulp.watch([
          'source/js/**/*.js',
          '!source/js/draft/*.js'
      ], ['scripts']);
});

gulp.task('lint', function () {
    return gulp.src([
        'source/**/*.js',
        '!source/third-party/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// BROWSER-SYNC
gulp.task('browser-sync', function () {
  browserSync.init();
});

// START THE SERVER
gulp.task('start', function () {
  nodemon({
    script: 'app.js',
    env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('build', ['html', 'sass', 'scripts', 'watch']);

gulp.task('test', ['build']);

gulp.task('watch', ['scripts:watch', 'html:watch', 'sass:watch']);

gulp.task('default', ['browser-sync', 'build', 'start']);
