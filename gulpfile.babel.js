const gulp = require('gulp');
const zip = require('gulp-zip');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');

const minimist = require('minimist');

const knownOptions =  {
    string: 'browser',
    alias: 'b',
    default: {'browser': 'chrome'}
};

const options = minimist(process.argv.slice(2), knownOptions);

export const clean = () => del(['dist/chrome', 'dist/firefox']);

export function copyIcons() {
    // Copy required icons
    return gulp.src('assets/icons/main/**', { base: '.' })
        .pipe(gulp.dest(`dist/${options.browser}`));
};

export function copyManifest() {
    // Copy manifest file
    return gulp.src(`manifest.${options.browser}.json`)
        .pipe(rename('manifest.json'))
        .pipe(gulp.dest(`dist/${options.browser}`));
};

export function copyHtml() {
    // Copy main HTML page
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest(`dist/${options.browser}`));
};

export function minify () {
    // Copy and minify source files
    return gulp.src('src/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(`dist/${options.browser}`));
};

export function zipFiles() {
    // Zip file once preceding tasks are completed
    return gulp.src(`dist/${options.browser}/*`)
        .pipe(zip(`bundle.${options.browser}.zip`))
        .pipe(gulp.dest(`dist`));
};

const bundle = gulp.series(clean, gulp.parallel(copyIcons, copyManifest, copyHtml, minify), zipFiles);

gulp.task('bundle', bundle);

export default bundle;