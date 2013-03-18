# projmate-filters

Projmate supported filters.


## Filters

Filter          | Description
----------------|-------------
*addHeader*     | Adds buffer header.
*cat*           | Concatenates one or more buffers.
*coffee*        | Compiles CoffeeScript.
*commonJsify*   | Creates browser-compatible CommonJS package. Based on stitch.
*functoid*      | Create ad-hoc filters.
*less*          | Compile less scripts.
*loadFiles*     | Loads files into buffers.
*preproc*       | Preprocessor
*recess*        | Recess CSS tool
*template*      | Consolidate template engines (defaults to underscore)
*uglify*        | Javascript minifier, beautifier
*writeFiles*    | Writes files to file system.


## Filter

A `FileAsset` is a file based asset. Assets, for now, are from the
local file system but there is no reason an asset could not from the cloud
via a URL, or a database.

A `Filter` is reponsible for processing a single asset.

A `TaskProcessor` processes one or more assets and directly set properties
on a task. For example `commonJisfy`, `loadFiles` and `writeFiles` are
task processors as they manipulate multiple assets. `loadFiles` also sets
the initial assets for a task.


## Projmate filter v GruntJS plugin

Projmate filter

```coffeescript
module.exports = (Projmate) ->
  class Coffee extends Projmate.Filter
    extnames: ".coffee"
    outExtname: ".js"

    process: (asset, options, cb) ->
      try
        js = coffee.compile(asset.text, options)
        cb null, js
      catch ex
        cb ex
```

GruntJS plugin


```javascript
module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask('coffee', 'Compile CoffeeScript files into JavaScript', function() {
    var path = require('path');

    var options = this.options({
      bare: false,
      separator: grunt.util.linefeed
    });

    if (options.basePath || options.flatten) {
      grunt.fail.warn('Experimental destination wildcards are no longer supported. please refer to README.');
    }

    grunt.verbose.writeflags(options, 'Options');

    this.files.forEach(function(f) {
      var output = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        return compileCoffee(filepath, options);
      }).join(grunt.util.normalizelf(options.separator));

      if (output.length < 1) {
        grunt.log.warn('Destination not written because compiled files were empty.');
      } else {
        grunt.file.write(f.dest, output);
        grunt.log.writeln('File ' + f.dest + ' created.');
      }
    });
  });

  var compileCoffee = function(srcFile, options) {
    options = grunt.util._.extend({filename: srcFile}, options);

    if (require('path').extname(srcFile) === '.litcoffee') {
      options.literate = true;
    }

    var srcCode = grunt.file.read(srcFile);

    try {
      return require('coffee-script').compile(srcCode, options);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn('CoffeeScript failed to compile.');
    }
  };
};
```

## License

Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>

See the file LICENSE for copying permission.




