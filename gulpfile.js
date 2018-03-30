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
    pages: ['src/*.html'],
    styles: ['src/scss/**/*.scss'],
    styleIncludes: ['node_modules/normalize.css/'],
};

const browserifyOptions = {
  basedir: '.',
  debug: true,
  entries: ['src/ts/main.ts'],
  cache: {},
  packageCache: {}
};

function bundle(browserifyFunc) {
  browserifyFunc
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist'));
}

const watchedBrowserify = watchify(browserify(browserifyOptions).plugin(tsify));
watchedBrowserify.on('update', () => bundle(watchedBrowserify));
watchedBrowserify.on('log', gutil.log);

gulp.task('copy-html', () =>
  gulp.src(paths.pages)
      .pipe(gulp.dest('dist')));

gulp.task('scripts', () =>
    bundle(browserify(browserifyOptions).plugin(tsify)));

gulp.task('styles', () =>
  gulp.src(paths.styles)
      .pipe(sourcemaps.init())
      .pipe(sass({
            outputStyle: 'compressed',
            includePaths: paths.styleIncludes})
          .on('error', sass.logError))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist')));

gulp.task('watch-html', () => gulp.watch(paths.pages, ['copy-html']));
gulp.task('watch-scripts', () => bundle(watchedBrowserify));
gulp.task('watch-styles', () => gulp.watch(paths.styles, ['styles']));

gulp.task('default', ['copy-html', 'scripts', 'styles']);
gulp.task('watch', ['default', 'watch-html', 'watch-scripts', 'watch-styles']);
