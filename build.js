var path = require('path');
var Builder = require('systemjs-builder');
System.buildCSS = false;
var builder = new Builder();
builder.loadConfig('config.js')
    .then(function() {
        return builder.buildSFX('./source/app.js', './dist/build.js')
            .then(function() {
                console.log('Build complete');
            })
            .catch(function(err) {
                console.log('Build error');
                console.log(err);
            });
    });