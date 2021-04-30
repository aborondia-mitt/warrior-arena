const gulp = require('gulp');
const { src, dest, series, parallel } = require('gulp');
const concat = require('gulp-concat');
const htmlReplace = require('gulp-html-replace');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

function htmlTask() {
  return src('src/*.html')
    .pipe(htmlReplace({
      js: 'js/bundle.js',
    }))
    .pipe(dest('dist'));
}
function scriptsTask() {
  return src(['src/js/domElements.js', 'src/js/animation.js', 'src/js/characters.js', 'src/js/engine.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/js'));
}

function stylesTask() {
  return src('src/styles/*.css')
  .pipe(dest('dist/styles'));
}

function imagesTask() {
  return src('src/images/*')
  .pipe(imagemin())
  .pipe(dest('dist/images'));
}

function audioTask() {
  return src('src/audio/*')
  .pipe(dest('dist/audio'));
}

exports.html = htmlTask;
exports.scripts = scriptsTask;
exports.css = stylesTask;
exports.images = imagesTask;
exports.audio = audioTask;
exports.default = parallel(htmlTask, scriptsTask, stylesTask, audioTask, imagesTask);
// exports.default = series(copyHtml, copyScripts, copyStyles, copyImages, copyAssets);
// exports.[name] = [function]