'use strict'

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	nodemon = require('gulp-nodemon'),
    eslint = require('gulp-eslint'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
    outputDir = {
        css: 'dist/css',
        js: 'dist/js',
        assets: '/dist/assets'
    };

browserSync = browserSync.create();

// SASS
gulp.task('sass', function () {
  return gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer())
    .pipe(gulp.dest(outputDir.css))
    .pipe(browserSync.stream());
});

// ASSETS
gulp.task('assets', function () {
  return gulp.src('assets/**/*.*')
    .pipe(gulp.dest(outputDir.assets))
});

gulp.task('sass:watch', function () {
  gulp.watch('sass/**/*.scss', ['sass']);
});

// SCRIPTS
gulp.task('scripts', function() {
  return gulp.src([
          'js/**/*.js',
          '!js/draft/*.js'
      ])
    .pipe(uglify())
    .pipe(gulp.dest(outputDir.js))
    .pipe(browserSync.stream());
});

gulp.task('scripts:watch', function () {
  gulp.watch([
          'js/**/*.js',
          '!js/draft/*.js'
      ], ['scripts']);
});

gulp.task('lint', function () {
    return gulp.src([
        'js/**/*.js',
        '!js/third-party/**/*.js'])
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

gulp.task('build', ['sass', 'scripts', 'watch']);

gulp.task('test', ['build']);

gulp.task('watch', ['scripts:watch', 'sass:watch']);

gulp.task('default', ['browser-sync', 'build', 'assets', 'start']);
