import { Router, RouterConfiguration } from 'aurelia-router';

export class ChildRouter {
    heading = 'Child Router';
    router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { route: ['', 'welcome'], name: 'welcome', moduleId: './welcome', nav: true, title: 'Welcome' },
            { route: 'flickr', name: 'flickr', moduleId: './flickr', nav: true, title: 'Flickr' },
            { route: 'child-router', name: 'childRouter', moduleId: './child-router', nav: true, title: 'Child Router' }
        ]);

        this.router = router;
    }
}
