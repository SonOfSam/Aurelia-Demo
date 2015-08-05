var gulp = require('gulp');
var typescript = require('gulp-typescript');
var plumber = require('gulp-plumber');
var flatten = require('gulp-flatten');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();
var exec = require('child_process').exec;
var jspm = require('jspm');
var shell = require('child-process-promise');
var tsProject = typescript.createProject('dev/tsconfig.json');
var aurelia = require('aurelia-cli');
var fs = require('fs');

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

gulp.task('task', function(cb) {
    exec('ping localhost', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

/**
 * Bundle aurelia-framework into one file
 */
gulp.task('bundle', function (done) {

    var distFile = 'aurelia.js';
    var outputFile = compilePath + distFile;

    var cmd = [        
      'aurelia-bootstrapper',      
      'aurelia-http-client',
      'core-js',
      'github:aurelia/dependency-injection@0.9.1',
      'github:aurelia/framework@0.13.4',
      'github:aurelia/router@0.10.3',      

      'github:aurelia/metadata@0.7.1',
      'github:aurelia/task-queue@0.6.1',
      'github:aurelia/event-aggregator@0.6.2',
      'github:aurelia/templating@0.13.15',
      'github:aurelia/history@0.6.1',
      'github:aurelia/history-browser@0.6.2',      
      'github:aurelia/templating-router@0.14.1',
      'github:aurelia/templating-resources@0.13.3',
      'github:aurelia/templating-binding@0.13.2',
      'github:aurelia/binding@0.8.4',
      'github:aurelia/loader-default@0.9.1'      

    ].join(' + ');

    jspm.bundle(cmd, distFile, { inject: true, minify: true }).then(function () {
        fs.rename(distFile, outputFile, function () {            
            done();
        });
    });

});

/**
 * Bundle application and vendor files.
 */
gulp.task('bundle-app', function (done) {

    var distFile = 'app-bundle.js';
    var outputFile = paths.output + distFile;

    if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

    var cmd = "**/* - aurelia";
    jspm.bundle(cmd, distFile, { inject: true, minify: true }).then(function () {
        fs.rename(distFile, outputFile, function () {            
            done();
        });
    });

});

/**
 * unbundle the aurelia-framework and use separate files again
 */
gulp.task('unbundle', function () {
    return shell.exec('jspm unbundle');
});