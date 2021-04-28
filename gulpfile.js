const gulp = require('gulp');
const { src, dest, series, parallel } = require('gulp');

function copyHtml() {
  return src('src/*.html').pipe(dest('dist'));
}
function copyScripts() {
  return src('src/js/*.js').pipe(dest('dist/js'));
}

function copyStyles() {
  return src('src/styles/*.css').pipe(dest('dist/styles'));
}

function copyImages() {
  return src('src/images/*').pipe(dest('dist/images'));
}

function copyAudio() {
  return src('src/audio/*').pipe(dest('dist/audio'));
}

exports.default = parallel(copyHtml, copyScripts, copyStyles, copyImages, copyAssets);