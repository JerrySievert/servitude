# Servitude

[![Build Status](https://secure.travis-ci.org/JerrySievert/servitude.png)](http://travis-ci.org/JerrySievert/servitude)

Super fast sugar for optimizing CSS and JavaScript.

Servitude combines CSS and JavaScript into a single fast and cacheable file, speeding up your site without a ton of extra work.

It's easy, just drop your JavaScript and CSS into a directory, point to it, and list out what you want to include in the order you want to include it.  `servitude` will inject it into the DOM and your application will be better for it.  No more tons of requests, a single request and everything becomes ready to use.

Optimize without even thinking about it.

Support out of the box for:

* CSS
* JavaScript
* CoffeeScript
* Stylus
* Less
* Pluggable Filters

# Installing

    $ npm install servitude

# Usage

## Server Side

    var servitude = require('servitude');
    var bricks = require('bricks');
    
    var appServer = new bricks.appserver();
    
    appServer.addRoute("/servitude(.+)", servitude, { basedir: "./files" });
    var server = appServer.createServer();
    
    server.listen(3000);

## Client Side

    <!-- include js/jquery.js and css/site.css in one fell swoop -->
    <script type="text/javascript" src="/servitude/js/jquery.js,/css/site.css"></script>
    <!-- include even more, you can use servitude as many times as you need -->
    <script type="text/javascript" src="/servitude/js/templates.js,/css/templates.css"></script>

# Advanced Usage

## Server Side

### Caching

Enabling caching stores requested files in memory, and only re-retrieves and re-processes a file if it has been changed on disk.

    appServer.addRoute("/servitude/(.+)", servitude, { basedir: "./files", cache: true });

### Uglify

If `uglify` is enabled in the `options`, an attempt is made to `uglify` any JavaScript that has been requested.  Note, this occurs even if the JavaScript has been previously minified, as well as for any `.coffee` file that has been compiled.  This may not be desired behavior, so this is turned off by default

    appServer.addRoute("/servitude/(.+)", servitude, { basedir: "./files", uglify: true });

### Filters

Filters are more powerful and allow you to process any file as you would like.  This is a good way to add something like `Handlebars` template compilation.  Simply set the `data` property on the `record` to the `JavaScript` or `CSS` that should be injected, and the `processed` property on the `record` to a string containing either a `servitude.injectCSS()` or `servitude.injectJS()` call containing `JSON.stringify(record)`:

    var filter = function (record, options, callback) {
      record.data = 'var Templates = Templates || { };' +
                    'Templates[\"' + record.filename + '\"] = Handlebars.template("' +
                    handlebars.precompile(record.data) + '");';
    
      record.processed = 'injectJS(' + JSON.stringify(record)  + ');';

      callback(null, record);
    };
    
    appServer.addRoute("/servitude/(.+)",
                       servitude,
                       { basedir: "./files", filters: { ".+handlebars$": filter } });


## Client Side

A `servitude` object is returned with all methods for injection into the DOM.

    
    if (servitude.errors.length) {
      console.log("errors: ");
      console.dir(servitude.errors);
    }

Injection occurs via the `servitude.injectCSS()`  and `servitude.injectJS()` methods upon load.