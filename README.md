# Servitude

[![Build Status](https://secure.travis-ci.org/JerrySievert/servitude.png)](http://travis-ci.org/JerrySievert/servitude)

Super fast sugar for optimizing CSS and JavaScript.

Servitude combines CSS and JavaScript into a single fast and cacheable file, speeding up your site without a ton of extra work.

It's easy, just drop your JavaScript and CSS into a directory, point to it, and list out what you want to include in the order you want to include it.  `servitude` will inject it into the DOM and your application will be better for it.  No more tons of requests, a single request and everything becomes ready to use.

Optimize without even thinking about it.

# Installing

    $ npm install servitude

# Usage

## Server Side

    var servitude = require('servitude');
    var bricks = require('bricks');
    
    var appServer = new bricks.appserver();
    
    appServer.addRoute("/servitude/(.+)", servitude, { basedir: "./files" });
    var server = appServer.createServer();
    
    server.listen(3000);

## Client Side

    <!-- include js/jquery.js and css/site.css in one fell swoop -->
    <script type="text/javascript" src="/servitude/js/jquery.js,css/site.css"></script>

That's it!