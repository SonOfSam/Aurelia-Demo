# Aurelia-Demo
Aurelia Demo using TypeScript via gulp

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). 

### Current Status
The last focus was on getting the backend equipped with an OpenId server, which would be used for authentication. I have also added the basic authentication related code in the web client that can at this point, login, and logout, request a token and refresh a token. There is also code that enables a simplified way of adding a token to outgoing requests, finally there is an interceptor that will attempt to silently refresh an expired token. To help showcase these in action, currently on the login page, there are various buttons that just call methods in the view model, that either logs in, make an authenticated request to the server, make an un-authenticated request and a method that will request that a given token is refreshed.

### Next Steps
1. Update to Latest Aurelia bits.

### Project Intent
We intend on implementing an order entry system in the project, so that more features of the various frameworks on both the server and client can be exposed. Ideally the project would closely resemble a real world application so that it may be used as reference to the various framework communities. 

Very specific to the front end, the idea is to implement various pieces of functionality required by the application, as development goes on, some of this functionality where it makes sense, will be extracted into their own repositories which will become reusable Aurelia components, which can be used by the community.

### Project Details
This project is still currently, work in progress. However it is still runs correctly provided you perform the correct steps.
These details can be found below. 

The idea behind this project, is to show how one can use an ASP.NET vNext project to host an Aurelia application.
One key aspect is that I wanted to get the "compile on save" ability back, so that we did not have to stop the development server do a build and then run again. There is a watch task that will watch for html and Typescript changes and then perform the appropriate steps.
Once the compile has been completed you can simply refresh the browser.

There is also a task that will allow you to use browser sync, so that you don’t manually have to refresh the page after changes are made.
This requires browser sync to run in proxy mode, meaning you would access the application via the proxy that gets created.

Note that the tasks that are used below are simply the starting points for future work, where they will be combined in various configurations to assist getting running faster. 

There are also tasks defined for creating a bundle and then unbundling, the exact process that should be followed is still being worked on.

## Running The App

To run the app, follow these steps.

1.  Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g jspm
  ```
  > **Note:** jspm queries GitHub to install semver packages, but GitHub has a rate limit on anonymous API requests. It is advised that you configure jspm with your GitHub credentials in order to avoid problems. You can do this by executing `jspm registry config github` and following the prompts.
2. Install the client-side dependencies with jspm:

  ```shell
  jspm install -y
  ```
  >**Note:** Make sure to run this command in the `src/AureliaDemo` folder where the project.json is located. Windows users, if you experience an error of "unknown command unzip" you can solve this problem by doing `npm install -g unzip` and then re-running `jspm install`.
3. Run `npm install` (this will install local gulp used by the next steps)
3. Run `gulp copy-jspm-libs` (gulp task)
  >This will copy the files from where jspm install places the libraries, into the correct directory in the wwwroot folder.
4. Run `gulp copy-jspm-config` (gulp task)
  >This will copy the `config.js` file to the correct directory in the wwwroot folder
5. Run `gulp process-css` (gulp task)
  >This will copy the css files to the correct directory in the wwwroot folder
6. Run `gulp process-html` (gulp task)
  >This will copy the html files to the correct directory in the wwwroot folder
7. Run `gulp compile-typescript` (gulp task)
  >This will copy the html files to the correct directory in the wwwroot folder
8. You should now be able to run the project.

##Authentication

More to follow soon.
