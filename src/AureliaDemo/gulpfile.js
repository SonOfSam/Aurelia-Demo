var gulp = require('gulp');
var typescript = require('gulp-typescript');
var plumber = require('gulp-plumber');
var flatten = require('gulp-flatten');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();
var tsProject = typescript.createProject('dev/tsconfig.json');

var compilePath = 'wwwroot/';
var tsPath = 'dev/**/*.ts';
var htmlPath = 'dev/**/*.html';
var devAll = 'dev/**/*.*';

var onError = function (err) {
    console.log(err);
}

gulp.task('compile-typescript', function () {
    tsProject.src()
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(typescript(tsProject))
        .pipe(gulp.dest(compilePath))
        .pipe(notify({ message: 'Compile typescript complete.' }));
});

gulp.task('process-html', function () {
    gulp.src([htmlPath])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest(compilePath))
        .pipe(notify({ message: 'Process html changes complete' }));
});

gulp.task('copy-aurelia-typings', function () {
    gulp.src(['wwwroot/app/jspm_packages/github/aurelia/*/*.d.ts'])
        .pipe(flatten())
        .pipe(gulp.dest('dev/typings/aurelia/'))
        .pipe(notify({ message: 'Copy d.ts files from Aurelia complete' }));
});

gulp.task('watch-ts', function () {
    return gulp.watch([tsPath], ['compile-typescript']);
});

gulp.task('watch-html', function () {
    return gulp.watch([htmlPath], ['process-html']);
});

gulp.task('watch', function () {

    gulp.watch([tsPath], ['compile-typescript']);

    gulp.watch([htmlPath], ['process-html']);

    //browserSync.init({
    //    proxy: 'http://localhost:35718/'
    //});

    //gulp.watch([devAll]).on('change', function() {
    //    browserSync.reload();
    //});
});

