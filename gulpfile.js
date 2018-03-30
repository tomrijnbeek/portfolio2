const gulp = require('gulp');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const tsify = require('tsify');
const uglify = require('gulp-uglify');
const watchify = require('watchify');
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

function bundle() {
  watchedBrowserify
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist'));
}

gulp.task('copy-html', () =>
  gulp.src(paths.pages)
      .pipe(gulp.dest('dist')));

gulp.task('styles', () =>
  gulp.src('src/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['node_modules/normalize.css/']})
          .on('error', sass.logError))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist')));

gulp.task('watchedStyles', () => gulp.watch('src/**/*.scss', ['styles']));
watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', gutil.log);

gulp.task('default', ['copy-html', 'styles', 'watchedStyles'], bundle);
