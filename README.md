brewGet
===

brewGet is a web application that supports the non-monetary exchange of regionally-limited or otherwise difficult to acquire beer. Built with [Node.js](https://nodejs.org/), [Koa](http://koajs.com/), and [AngularJS](http://angularjs.org/).

##Installing and Running Locally

Instructions and requirements for installing this web application.

###Dependencies

[Node.js](https://nodejs.org/)  
[MongoDB](http://www.mongodb.org/)  

######Dependency Notes

brewGet is built with [Koa](http://koajs.com/), which requires Node 0.11.9 or greater, and that Node be run with the `--harmony` flag. Alternatively, the current stable branch (Node 0.10.x) can be used in conjunction with [gnode](https://github.com/TooTallNate/gnode). See [Koa](http://koajs.com/) documentation for additional notes.

###Getting Started

While in the project root directory:   

```
npm install
node --harmony server
```
If you would like to use `npm start` as it is specified in `package.json`, install [Nodemon](http://remy.github.io/nodemon/):  

```
npm install nodemon -g
```

##Appendix

###Citations

######General

This project has been influenced (in direct code and/or philosophy) by the following:

[Angular Seed](https://github.com/angular/angular-seed)  
Copyright (c) 2010-2012 Google, Inc. < [http://angularjs.org](http://angularjs.org) >  
The MIT License (MIT)

[Nodejs Express Mongoose Demo](https://github.com/madhums/node-express-mongoose-demo)   
Copyright (c) 2012 Madhusudhan Srinivasa < [madhums8@gmail.com](mailto:madhums8@gmail.com) >  
The MIT License (MIT)

######Libraries

* [AngularJS](http://angularjs.org/)
* [Bower](http://bower.io/)
* [Caja HTML Sanitizer](https://github.com/theSmaw/Caja-HTML-Sanitizer)
* [Compass](http://compass-style.org/)
* [Font Awesome](http://fontawesome.io/)
* [Grunt](http://gruntjs.com/)
* [HTML5 Boilerplate](http://html5boilerplate.com/)
* [Koa](http://koajs.com/)
* [Mongoose](http://mongoosejs.com/)
* [Nodemon](http://remy.github.io/nodemon/)
* [Normalize.css](http://necolas.github.io/normalize.css/)
* [Q](http://documentup.com/kriskowal/q/)
* [RequireJS](http://requirejs.org/)
* [Socket.IO](http://socket.io/)
* [Sass](http://sass-lang.com/)
* [Susy](http://susy.oddbird.net/)
* [UglifyJS](http://lisperator.net/uglifyjs/)
* [Underscore](http://underscorejs.org/)
* [Node-Validator](https://github.com/chriso/node-validator)

###Structure

```
brewGet
|
|--client (AngularJS app)
|	|--app
|	|	|--views
|	|	|	+--[AngularJS html templates]
|	|	|
|	|	|--controllers.js (AngularJS controllers)
|	|	|--directives.js (AngularJS directives)
|	|	|--filters.js (AngularJS filters)
|	|	+--services.js (AngularJS services)
|	|
|	|--assets
|	|	|--css
|	|	|	+--[stylesheets]
|	|	|
|	|	|--fonts
|	|	|	+--[web fonts]
|	|	|
|	|	|--img
|	|	|	+--[images]
|	|	|
|	|	|--lib
|	|	|	+--[Bower installed libraries]
|	|	|
|	|	|--scss
|	|	|	+--[Sass files]
|	|	|
|	|	+--config.rb (Compass configuration)
|	|
|	|--config
|	|	|--app.js (RequireJS dependency bootstrap and AngularJS modules configuration)
|	|	+--routes.js (AngularJS routes)
|	|
|	+--index.html (AngularJS html template)
|
|--node_mondules
|	+--[npm installed libraries]
|
|--server
|	|--app (Koa app)
|	|	|--controllers
|	|	|	+--[Koa controllers]
|	|	|
|	|	|--middleware
|	|	|	+--[Koa middleware]
|	|	|
|	|	+--models
|	|		+--[Koa models]
|	|
|	|--assets
|	|	|--lib
|	|	|	+--[backend utilities]
|	|	|
|	|	+--tmp
|	|		+--[temporary files]
|	|
|	|--config
|	|	|--app.js (Koa app configuration)
|	|	|--config.default.js (template for contextual parameter values)
|	|	|--config.js (contextual parameter values)
|	|	|--messages.js (global messages file)
|	|	|--mongo.js (MongoDB configuration)
|	|	|--passport.js (Passport configuration)
|	|	+--routes.js (Koa routes)
|	|
|	|--test
|	|	+--[testing files]
|	|
|	+--index.js (bootstrap for Koa app)
|  
|--.bowerrc
|--.gitignore
|--bower.json
|--Gemfile
|--Gemfile.lock
|--gruntfile.js
+--package.json
```


### License

The MIT License (MIT)

Copyright (c) 2013 Michael J. Bondra < [mjbondra@gmail.com](mailto:mjbondra@gmail.com) >

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
