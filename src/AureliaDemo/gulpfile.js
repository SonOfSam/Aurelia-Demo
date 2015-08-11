/// <binding />
var gulp = require('gulp');
var typescript = require('gulp-typescript');
var plumber = require('gulp-plumber');
var flatten = require('gulp-flatten');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();
var exec = require('child_process').exec;
var jspm = require('jspm');
var shell = require('child-process-promise');
var aurelia = require('aurelia-cli');
var fs = require('fs');
var clean = require('gulp-clean');

var compilePath = 'wwwroot/';
var devRoot = 'dev/';
var appRoot = compilePath + 'app/';

var jspmFilesExcludePath = '!' + devRoot + 'app/jspm_packages/**/*.*';
var jspmPath = devRoot + 'app/jspm_packages/**/*.*';
var jspmOutputPath = compilePath + 'app/jspm_packages';
var jspmConfigFilePath = devRoot + 'app/config.js';
var tsFilesPath = devRoot + '**/*.ts';
var htmlFilesPath = devRoot + '**/*.html';
var assetFilesPath = devRoot + '**/*.png';
var cssFilesPath = devRoot + '**/*.css';
var devAll = devRoot + '**/*.*';
var tsProjectPath = devRoot + 'tsconfig.json';
var tsProject = typescript.createProject('dev/tsconfig.json');

var onError = function (err) {
    console.log(err);
}

/**
 * Removes all of the contents from the wwwroot directory.
 */
gulp.task('clean', function() {
    gulp.src(compilePath + 'app/', { read: false })
        .pipe(clean({force: true}));
});

gulp.task('compile-typescript', function () {
    tsProject.src()
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(typescript(tsProject))
        .pipe(gulp.dest(compilePath));
});

gulp.task('copy-jspm-config', function() {
    gulp.src([jspmConfigFilePath])
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(gulp.dest(appRoot));
});

gulp.task('copy-jspm-libs', function() {
    gulp.src([jspmPath])
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(gulp.dest(jspmOutputPath));
});

gulp.task('process-html', function () {
    gulp.src([htmlFilesPath, jspmFilesExcludePath])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest(compilePath));
});

gulp.task('process-assets', function () {
    gulp.src([assetFilesPath, jspmFilesExcludePath])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest(compilePath));
});

gulp.task('process-css', function () {
    gulp.src([cssFilesPath, jspmFilesExcludePath])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest(compilePath))
        .pipe(notify({ message: 'Process css changes complete' }));
});

gulp.task('watch-ts', function () {
    return gulp.watch([tsFilesPath], ['compile-typescript']);
});

gulp.task('watch-html', function () {
    return gulp.watch([htmlFilesPath], ['process-html']);
});

gulp.task('watch', function () {

    gulp.watch([tsFilesPath], ['compile-typescript']);

    gulp.watch([htmlFilesPath], ['process-html']);

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