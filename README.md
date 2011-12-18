# Servitude

Super fast sugar for optimizing CSS and JavaScript.

Servitude combines CSS and JavaScript into a single fast and cacheable file, speeding up your site without a ton of extra work.

# Usage

## Server Side

    var servitude = require('servitude');
    var bricks = require('bricks');
    
    var appServer = new bricks.appserver();
    
    appServer.addRoute("/servitude/(.+)", servitude, { basedir: "./files" });
    var server = appServer.createServer();
    
    server.listen(3000);

## Client Side

    <script type="text/javascript" src="/servitude/js/jquery.js,css/site.css"></script>

That's it!