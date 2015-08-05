function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging();
    aurelia.start().then(function (a) { return a.setRoot('app/app'); });
}
exports.configure = configure;
