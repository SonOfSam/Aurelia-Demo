﻿import { inject } from 'aurelia-framework';
import { HttpClientExtensions } from 'core/CoreHelpers'
import Aureliarouter = require("aurelia-router");
import RouterConfiguration = Aureliarouter.RouterConfiguration;
import Router = Aureliarouter.Router;

@inject(HttpClientExtensions)
export class App {
    router: Aureliarouter.Router;
    httpExtensions: HttpClientExtensions = null;

    constructor(httpExtensions: HttpClientExtensions) {
        this.httpExtensions = httpExtensions;
    }

    configureRouter(config: RouterConfiguration, router: Router) {        
        config.title = 'Aurelia';
        config.map([
            { route: ['', 'welcome'], name: 'welcome', moduleId: './welcome', nav: true, title: 'Welcome' },
            { route: 'flickr', name: 'flickr', moduleId: './flickr', nav: true, title: 'Flickr' },
            { route: 'child-router', name: 'childRouter', moduleId: './child-router', nav: true, title: 'Child Router' },         
            { route: 'login', moduleId: './core/components/login/login'}        
        ]);

        this.router = router;
    }

    activate() {        
        this.httpExtensions.configure();
    }
}
