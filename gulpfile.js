const gulp = require("gulp");
const browserify = require("browserify");
const buffer = require('vinyl-buffer');
const gutil = require("gulp-util");
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const tsify = require("tsify");
const uglify = require('gulp-uglify');
const watchify = require("watchify");
const paths = {
    pages: ['src/*.html']
};

const watchedBrowserify = watchify(browserify({
      basedir: '.',
      debug: true,
      entries: ['src/main.ts'],
      cache: {},
      packageCache: {}
    })
    .plugin(tsify));

gulp.task("copy-html", () =>
  gulp.src(paths.pages)
      .pipe(gulp.dest("dist")));

function bundle() {
  watchedBrowserify
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest("dist"));
}

gulp.task("default", ["copy-html"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
