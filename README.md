# Initialize App
## Install of NPM Modules, Required once
```npm install```

## Install of Ionic Plugins, Required once
```ionic state restore```



---------------------------------
# Angular2 Startup
```npm start```

## Angular2 Build
To Compile everything into dist/ for distro
```npm run build```



---------------------------------
# Ionic2 Startup
```npm run ionic-serve```


## Ionic2 Build
Compiles everything into www/
```npm run ionic-build```

*ionic-build has same Switches as ionic-serve


---------------------------------
### Node Server Startup
* Copy backend/sample.env to backend/.env and fixup any environment variables
```cd backend && node server.js```


---------------------------------
## Config Updates
Set defaults, localhost:3080 for backend services
```gulp configs```

### Additional gulp config switches
--release
Sets debugging to false

--host localhost:3080
Sets Madame Server / Socket Host


---------------------------------
## Update NPM Modules
```npm update```



## File Structure
We use the standard component based approach. We combine files in the following areas; backend server, browser views, mobile views, and app services. Within the browser and mobile view folders we group singleton components and combined components that make up modules. 
```
angular2-ionic2-webpack/
 ├──backend/                    * Serverside Application, self-contained
 │   ├──db/                       * holds db connection files
 │   │   └──db_knex_strictd_mysql.js * default database connection library
 │   │
 │   ├──modules/                  * backend modules, restful routes and functionality
 │   │   ├──login/                  * backend login module pack
 │   │   │   ├──crypto-imap.js         * crypto library for imap authentication
 │   │   │   ├──crypto-pdkdf2.js       * crypto library for pdkdf encryption
 │   │   │   └──login.restful.js       * login restful endpoints
 │   │   │
 │   │   └──permission/              * backend permission module pack
 │   │       ├──permission.model.js    * permission functionality
 │   │       └──permission.restful.js  * permission restful endpoints
 │   │
 │   ├──.gitignore                * ignore files for backend directory
 │   ├──README.md                 * Server side Readme 
 │   ├──catchError.js             * Sockets error catching
 │   ├──package.json              * what npm uses to manage it's dependencies
 │   ├──sample.env                * example .env file, needs to be copied to .env and modified 
 │   └──server.js                 * node backend starting point, `node server.js`
 │
 │
 ├──src/                        * our source files that will be compiled to javascript
 │   ├──browser/                  * browser based view files for angular2 layouts
 │   │   ├──app/                    * WebApp: folder
 │   │   │   ├──app.component.ts      * a simple version of our App component components
 │   │   │   ├──app.module.ts         * root AppModule component
 │   │   │   ├──app.routing.ts        * specify root routing instructions
 │   │   │   ├──main.dev.ts           * development bootstraping
 │   │   │   ├──main.prod.ts          * production bootstraping
 │   │   │   ├──polyfills.ts          * our polyfills file
 │   │   │   └──vendor.ts             * our vendor file, add third party libraries here
 │   │   │
 │   │   │ 
 │   │   ├──assets/                 * any files you want copied to the public www directory
 │   │   │   ├──img/                  * public facing images
 │   │   │   ├──index.html            * index.html for public facing page
 │   │   │   └──service-worker.js     * placeholder for upcoming service-workers 
 │   │   │
 │   │   │ 
 │   │   ├──components/             * single components not part of a module
 │   │   │   ├──home/                 * sample homepage site view component
 │   │   │   │   ├──home.css            * homepage css styles
 │   │   │   │   ├──home.html           * homepage angular2 html
 │   │   │   │   └──home.ts             * homepage view component
 │   │   │   │
 │   │   │   └──login/                * sample login page view component
 │   │   │       ├──login.css           * login css styles
 │   │   │       ├──login.html          * login angular html
 │   │   │       └──login.ts            * homepage view component
 │   │   │
 │   │   │ 
 │   │   ├──modules/                * grouped components part of a module
 │   │   │   ├──headers               * sample module for headers
 │   │   │   │   ├──header              * sample header component
 │   │   │   │   │   ├──header.html
 │   │   │   │   │   └──header.ts
 │   │   │   │   │
 │   │   │   │   ├──navbar            * sample navbar component
 │   │   │   │   │   ├──navbar.css
 │   │   │   │   │   ├──navbar.html 
 │   │   │   │   │   └──navbar.ts
 │   │   │   │   │
 │   │   │   │   └──headers.module.ts * module imports and exports header and navbar
 │   │   │   │
 │   │   │   └──shared.module.ts    * global shared modules  
 │   │   │
 │   │   └──auth-guard.js         * login systems @CanActivate browser authguard
 │   │
 │   │
 │   ├──desktop/                * future home for angular-electron integration
 │   │
 │   │
 │   ├──mobile/                 * mobile view files for ionic2-angular2 layouts
 │   │   ├──app/                  * IonicApp folder
 │   │   │   ├──app.component.ts    * a simple version of our App component components
 │   │   │   ├──app.module.ts       * root AppModule component for Ionic
 │   │   │   └──main.prod.ts        * production bootstraping
 │   │   │
 │   │   ├──assets/               * any files you want copied to the public www directory
 │   │   │   ├──icon
 │   │   │   ├──manifest.json
 │   │   │   └──service-worker.js
 │   │   │
 │   │   ├──pages/                * ionic view components
 │   │   │   ├──about               * sample ionic tabs project about page
 │   │   │   ├──contact             * sample ionic tabs project contact page
 │   │   │   ├──home                * sample ionic tabs project home page
 │   │   │   └──tabs                * sample ionic tabs project entry page
 │   │   │
 │   │   ├──theme/                * mobile interface themes
 │   │   │   ├──app.core.scss
 │   │   │   ├──app.ios.scss
 │   │   │   ├──app.md.scss
 │   │   │   ├──app.variables.scss
 │   │   │   ├──app.wp.scss
 │   │   │   └──variables.scss 
 │   │   │
 │   │   └──index.html            * index.html for public facing page
 │   │
 │   │ 
 │   ├──services/               * services for retrieving api data from backend server
 │   │   ├──api.ts              * sample api angular2 service
 │   │   └──login-service.ts    * login service for angular2 auth-guard
 │   │
 │   └──style/                  * global style libraries
 │       └──app.scss              * global app styles
 │
 │
 ├──tsconfig/                   * tsconfig base files, copied to tsconfig.json with gulp
 │   ├──browser.json              * tsconfig file adjusted for angular2 compiles
 │   └──ionic.json                * tsconfig file adjusted for ionic2 compiles
 │
 │
 ├──webpack/                    * webpack config files, imported by webpack-ionic
 │   ├──webpack.common.js         * our common webpack config, imported by dev and prod
 │   ├──webpack.dev.js            * our development webpack config
 │   └──webpack.prod.js           * our production webpack config
 │
 │
 ├──.gitignore                  * ignore files for git repo
 ├──CHANGELOG.md                * list of changes made to repo
 ├──LICENSE                     * MIT License text
 ├──README.md                   * this file
 ├──config.app.ts               * angular2 @Injectable ConfigApp, provides global config options
 ├──config.xml                  * ionic2 project description file
 ├──gulpfile.js                 * worker to modify configs and initial ionic2 webpack
 ├──ionic-copy.config.js        * ionic-app-scripts copy updated config file
 ├──ionic.config.json           * ionic2 configuration
 ├──ionic.project               * ionic2 project info
 ├──karma-shim.js               * karam browser shim for unit tests
 ├──karma.conf.js               * karma config for our unit tests
 ├──package.json                * what npm uses to manage it's dependencies
 ├──protractor.conf.js          * protractor config for our end-to-end tests
 ├──tsconfig.json               * config that webpack uses for typescript
 ├──tslint.json                 * typescript lint config
 ├──typedoc.json                * typescript documentation generator
 ├──webpack-ionic.config.js     * webpack mobile angular2 configuration file
 └──webpack.config.js           * webpack browser angular2 configuration file
```


