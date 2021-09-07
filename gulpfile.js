// =================================================================================
// ------------------- 2021 Gulfile for WordPress development ---------------------
// =================================================================================

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const purgeCSS = require('gulp-purgecss');
const purgecssWordpress = require('purgecss-with-wordpress');
const postCSS = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const gulprename = require('gulp-rename');
const sassCompiler = require('gulp-sass')(require('sass'));

const config = require('./gulpconfig');

// =================================================================================
// ---------------------------------  CONSTANTS  -----------------------------------
// =================================================================================

const THEME = config.theme || "unknow";
const MOTHER_DIRECTORY = "wp-content/themes/";
const JS_FILES = `${MOTHER_DIRECTORY}${THEME}/**/*.js`;
const PHP_FILES = `${MOTHER_DIRECTORY}${THEME}/**/*.php`;
const SASS_FILES = `${MOTHER_DIRECTORY}${THEME}/**/*.scss`;
const SASS_INDEX = `${MOTHER_DIRECTORY}${THEME}/${config['sass-entry']}`;

// =================================================================================
// ---------------------------  PLUGINS CONFIG FILES  ------------------------------
// =================================================================================

const plugins = process.env.NODE_ENV === "production" 
   ? [ autoprefixer({}), cssnano() ] 
   : []

// =================================================================================
// --------------------------  COMPILE SASS/SCSS FILES  ----------------------------
// =================================================================================

gulp.task("compile sass", async () => {
   gulp.src(SASS_INDEX)
      .pipe(sassCompiler())
      .pipe(purgeCSS({
         content: [PHP_FILES],
         safelist: purgecssWordpress.safelist,
         safelistPatterns: purgecssWordpress.safelistPatterns
      }))
      .pipe(postCSS(plugins))
      .pipe(gulprename('bundle.css'))
      .pipe(gulp.dest(`${MOTHER_DIRECTORY}${THEME}/sass`))
      .pipe(browserSync.stream())
})

// =================================================================================
// ------------------------------  PROXY LIVE SERVER  ------------------------------
// =================================================================================

gulp.task("live proxy server", async () => {
   browserSync.init({
      proxy: config.path
   })

   gulp.watch(JS_FILES).on('change', browserSync.reload);
   gulp.watch(PHP_FILES, gulp.series('compile sass')).on('change', browserSync.reload);
   gulp.watch(SASS_FILES, gulp.series('compile sass'));

})


gulp.task("default", gulp.series("compile sass", "live proxy server"))