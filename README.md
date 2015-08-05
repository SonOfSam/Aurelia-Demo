# Aurelia-Demo
Aurelia Demo using TypeScript via gulp

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). Demo can be seen running on [Azure](http://aureliademo.azurewebsites.net/). Keep in mind that no bundling or any form of optimization has taken place before publishing to Azure, and it is also running in a shared and free instance and this will lead to slow load times.

### Project Details
This project is still currently, work in progress. However it is still runs correctly provided you perform the correct steps.
These details can be found below. 

The idea behind this project, is to show how one can use an ASP.NET vNext project to host an Aurelia application.
One key aspect is that I wanted to get the "compile on save" ability back, so that we did not have to stop the developement server
do a build and then run again. There is a watch task, that will watch for html and TypeScript changes and then perform the appropriate steps.
Once the compile has been completed you can simply refresh the browser.

There is also a task that will allow you to use browser sync, so that you dont manually have to refresh the page after changes are made.
This requires browser sync to run in proxy mode, meaning you would access the application via the proxy that gets created.

Note that the tasks that are used below are simply the starting points for future work, where they will be combined in various 
configurations to assist getting running faster. 

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
  >**Note:** Make sure to run this command in the AureliaDemo folder where the project.json is located. Windows users, if you experience an error of "unknown command unzip" you can solve this problem by doing `npm install -g unzip` and then re-running `jspm install`.
3. Run the 'copy-jspm-libs' task
  >This will copy the files from where jspm install places the libraries, into the correct directory in the wwwroot folder.
4. Run the 'copy-jspm-config' task
  >This will copy the config.js file to the correct directory in the wwwroot folder
5. Run the 'process-css' task
  >This will copy the css files to the correct directory in the wwwroot folder
6. Run the 'process-html' task
  >This will copy the html files to the correct directory in the wwwroot folder
7. Run the 'compile-typescript' task
  >This will copy the html files to the correct directory in the wwwroot folder
8. You should now be able to run the project.





