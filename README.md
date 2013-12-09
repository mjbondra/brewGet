brewGet
===

brewGet is a web application that supports the non-monetary exchange of regionally-limited or otherwise difficult to acquire beer.

##Installing and Running Locally

Instructions and requirements for installing this web application.

###Dependencies

[Node.js](https://nodejs.org/)  
[MongoDB](http://www.mongodb.org/)  

######Optional

If you would like to use `npm start` to launch this application, install [Nodemon](http://remy.github.io/nodemon/) globally.

```
npm install nodemon -g
```

###Getting Started

While in the project directory (with [Nodemon](http://remy.github.io/nodemon/)):   

```
npm install
npm start
```
OR (without [Nodemon](http://remy.github.io/nodemon/)):  

```
npm install
node server.js
```

##Appendix

###Citations

######General

This project has been influenced (in direct code and/or philosophy) by the following:

[Angular Seed](https://github.com/angular/angular-seed)  
Copyright (c) 2010-2012 Google, Inc. < [http://angularjs.org](http://angularjs.org) >  
The MIT License (MIT)

[Express Examples](https://github.com/visionmedia/express/tree/master/examples)  
Copyright (c) 2009-2012 TJ Holowaychuk < [tj@vision-media.ca](mailto:tj@vision-media.ca) >  
The MIT License (MIT)

[Nodejs Express Mongoose Demo](https://github.com/madhums/node-express-mongoose-demo)   
Copyright (c) 2012 Madhusudhan Srinivasa < [madhums8@gmail.com](mailto:madhums8@gmail.com) >  
The MIT License (MIT)

######Libraries

* [AngularJS](http://angularjs.org/)
* [Bower](http://bower.io/)
* [Caja HTML Sanitizer](https://github.com/theSmaw/Caja-HTML-Sanitizer)
* [Compass](http://compass-style.org/)
* [Connect-Flash](https://github.com/jaredhanson/connect-flash)
* [Connect-Mongo](http://kcbanner.github.io/connect-mongo/)
* [Express](http://expressjs.com/)
* [Font Awesome](http://fontawesome.io/)
* [Grunt](http://gruntjs.com/)
* [Gzippo](http://tomg.co/gzippo)
* [HTML5 Boilerplate](http://html5boilerplate.com/)
* [Mongoose](http://mongoosejs.com/)
* [Nodemon](http://remy.github.io/nodemon/)
* [Normalize.css](http://necolas.github.io/normalize.css/)
* [Passport](http://passportjs.org/)
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
|--app  
|	|--controllers
|	|	+--[backend controllers]
|	|
|	|--middleware
|	|	+--[backend middleware]
|	|
|	+--models
|		|--nested
|		|	+--[nestable backend models]
|		|
|		+--[backend models]
|
|--config
|	|--config.default.js
|	|--config.js
|	|--express.js
|	|--messages.js
|	|--passport.js
|	+--routes.js
|
|--lib
|	+--mongoose-validator.js
|
|--node_modules
|	+--[npm installed libraries]
|
|--public
|	|--css
|	|	+--main.css
|	|
|	|--fonts
|	|	+--[web fonts]
|	|
|	|--img
|	|	+--[images]
|	|
|	|--js
|	|	|--app-loader.js
|	|	|--app.js
|	|	|--controllers.js
|	|	|--directives.js
|	|	|--filters.js
|	|	+--services.js
|	|
|	|--lib
|	|	+--[bower installed libraries]
|	|
|	|--partials
|	|	+--[html templates]
|	|
|	|--scss
|	|	|--_desktop.scss
|	|	|--_high-pixel-density.scss
|	|	|--_html5-boilerplate.sccs
|	|	|--_mixins.scss
|	|	|--_mobile-landscape.scss
|	|	|--_normalize.scss
|	|	|--_tablet.scss
|	|	|--_vars.scss
|	|	+--main.scss
|	|
|	|--config.rb
|	+--index.html
|
|--tmp
|  
|--.bowerrc
|--.gitignore
|--bower.json
|--gruntfile.js
|--package.json
+--server.js  
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