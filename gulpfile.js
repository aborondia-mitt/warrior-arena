const gulp = require('gulp');
const { src, dest, series, parallel } = require('gulp');

function copyHtml() {
  return src('src/*.html').pipe(dest('dist'));
}
function copyScripts() {
  return src('src/js/*.js').pipe(dest('dist'));
}

function copyStyles() {
  return src('src/styles/*.css').pipe(dest('dist'));
}

function copyImages() {
  return src('src/images/*').pipe(dest('dist'));
}

function copyAssets() {
  return src('src/*-assets/**').pipe(dest('dist'));
}

exports.default = parallel(copyHtml, copyScripts, copyStyles, copyImages, copyAssets);