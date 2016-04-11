'use strict'

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');
var eslint = require('gulp-eslint');
var browserSync = require('browser-sync');
var gutil = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var browserify = require('gulp-browserify');
var outputDir = {
        css: 'dist/css',
        js: 'dist/js',
        sejs: 'dist/js/session-edit',
        assets: '/dist/assets'
    };

browserSync = browserSync.create();
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

gulp.task("default", ()=> {
});
// SASS
gulp.task('sass', ()=> {
  return gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer())
    .pipe(gulp.dest(outputDir.css))
    .pipe(browserSync.stream());
});

// ASSETS
gulp.task('assets', ()=> {
  return gulp.src('assets/**/*.*')
    .pipe(gulp.dest(outputDir.assets))
});

gulp.task('sass:watch', ()=> {
  gulp.watch('sass/**/*.scss', ['sass']);
});

// SCRIPTS
// gulp.task('scripts',() =>{
//     return gulp.src([
//         'js/**/*.js',
//         '!js/draft/*.js'
//     ])
//     .pipe(babel())
//     .pipe(gulp.dest(outputDir.js))
//     .pipe(browserSync.stream());
// });

gulp.task('scripts',() =>{
  gulp.src('js/app.js')
    .pipe(browserify({
      transform: ['babelify'],
    }))
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('scripts:watch', ()=> {
  gulp.watch([
          'js/**/*.js',
          '!js/draft/*.js'
      ], ['scripts']);
});

gulp.task('lint', ()=> {
    return gulp.src([
        'js/**/*.js',
        '!js/third-party/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// BROWSER-SYNC
gulp.task('browser-sync', ()=> {
  browserSync.init();
});

// START THE SERVER
gulp.task('start', ()=> {
  nodemon({
    script: 'app.js',
    env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('build', ['sass', 'scripts', 'assets']);

gulp.task('test', ['build']);

gulp.task('watch', ['scripts:watch', 'sass:watch']);

gulp.task('default', ['browser-sync', 'build', 'watch', 'start']);
