 # if (stat.isFile()) {
 #    fs.readFile(file, 'utf8', function(err, str){
 #      if (err) throw err;
 #      options.filename = file;
 #      options._imports = [];
 #      var style = stylus(str, options);
 #      if (includeCSS) style.set('include css', true);
 #      usePlugins(style);
 #      importFiles(style);
 #      style.render(function(err, css){
 #        watchImports(file, options._imports);
 #        if (err) {
 #          if (watchers) {
 #            console.error(err.stack || err.message);
 #          } else {
 #            throw err;
 #          }
 #        } else {
 #          writeFile(file, css);
 #        }
 #      });
 #    });


##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

_ = require("lodash")
path = require("path")


module.exports = (Projmate) ->
  stylus = require('stylus')

  schema =
    title: 'Compiles Stylus CSS'
    type: 'object'
    properties:
      linenos:
        type: 'boolean'
        description: 'Reference source line numbers in compiled CSS'
      paths:
        type: 'array'
        items:
          type: 'string'
        description: 'Paths containing assets?'
      compress:
        type: 'boolean'
        description: 'Whether to compress the output CSS'

    __:
      extnames: ".styl"
      outExtname: ".css"
      defaults:
        development: {linenos: true, compress: false}
        production: {linenos: false, compress: true}


  # Compiles a less buffer.
  class Stylus extends Projmate.Filter
    @schema: schema

    process: (asset, options, cb) ->
      # css - reverse compiles to stylus

      options.filename = asset.filename
      options.paths = [asset.dirname]

      try
        parser = new Parser(options)
        parser.parse asset.text, (err, tree) ->
          return cb(err) if err
          try
            css = tree.toCSS(options)
            cb null, css
          catch ex
            cb ex
      catch ex
        cb ex


