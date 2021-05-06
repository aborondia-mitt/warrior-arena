const gulp = require('gulp');
const browsersync = require('browser-sync');
const { src, dest, series, parallel, watch } = require('gulp');
const concat = require('gulp-concat');
const crLfReplace = require('gulp-cr-lf-replace');
const eslint = require('gulp-eslint');
const htmlReplace = require('gulp-html-replace');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

function browserSync() {
  return browsersync.init(
    {
      server: {
        baseDir: "./dist"
      },
      port: 3000,
    });
}

// add ip of pc, port to connect from another device

function htmlTask() {
  return src('src/*.html')
    .pipe(htmlReplace({
      js: 'js/bundle.js',
    }))
    .pipe(dest('dist'))
    .pipe(browsersync.stream());
}

function lintTask() {
  return src(['src/js/domElements.js', 'src/js/animation.js', 'src/js/characters.js', 'src/js/engine.js'])
    .pipe(crLfReplace())
    .pipe(eslint())
    .pipe(eslint.format());
}

function scriptsTask() {
  return src(['src/js/domElements.js', 'src/js/animation.js', 'src/js/characters.js', 'src/js/engine.js'])
    .pipe(crLfReplace())
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/js'))
    .pipe(browsersync.stream());
}

function stylesTask() {
  return src('src/css/*.css')
    .pipe(autoprefixer())
    .pipe(dest('dist/css'))
    .pipe(browsersync.stream());
}

function imagesTask() {
  return src('src/images/*')
    .pipe(imagemin())
    .pipe(dest('dist/images'))
    .pipe(browsersync.stream());
}

function audioTask() {
  return src('src/audio/*')
    .pipe(dest('dist/audio'))
    .pipe(browsersync.stream());
}

function watchFiles() {
  watch('./src/js/*.js', scriptsTask);
  watch('./src/images/*', scriptsTask);
  watch('./src/audio/*', scriptsTask);
  watch('./src/', scriptsTask);
}

exports.html = htmlTask;
exports.scripts = scriptsTask;
exports.css = stylesTask;
exports.images = imagesTask;
exports.audio = audioTask;
exports.lint = lintTask;
exports.watch = parallel(browserSync, watchFiles);
exports.dev = series(parallel(htmlTask, scriptsTask, stylesTask), parallel(browserSync, watchFiles));
exports.default = parallel(htmlTask, scriptsTask, stylesTask, audioTask);
exports.fulldist = parallel(htmlTask, scriptsTask, stylesTask, audioTask, imagesTask);
// exports.default = series(copyHtml, copyScripts, copyStyles, copyImages, copyAssets);
// exports.[name] = [function]