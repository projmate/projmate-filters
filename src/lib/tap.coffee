##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

_ = require('lodash')

module.exports = (Projmate) ->

  schema =
    title: 'Custom processing'
    type: 'object'
    properties:
      command:
        description: '(assets, options) or (assets, options, cb)'
        type: 'function'

    __:
      extnames: '*'
      examples: [
        title: 'Change file name from `src` to `build`'
        text:
          """
          f.tap(function(asset) {
            asset.filename = asset.filename.replace(/^src/, 'build');
          })
          """
      ,
        title: 'Replace a string in assets'
        text:
          """
          f.tap(function(asset, options, cb) {
            fs.readFile('common.txt', 'utf8', function(err, text) {
              if (err) return cb(err);
              asset.text = asset.text.replace('{{{common}}}', text);
              cb();
            });
          })
          """
      ,
        title: 'Pass options, must use long form'
        text:
          """
          f.tap({ foo: 'bar', command: function(asset, options) {
            // prints 'bar'
            console.log(options.foo);
          }})
          """
      ]


  # Difference between tap and Functoid is that doesn't return a value so
  # it does not change asset as a result of sync function.
  #
  # @example
  #
  # replaceVersion = f.functoid process: (asset, options) ->
  #   asset.text = asset.text.replace /VERSION/g, "1.0.1"
  class Tap extends Projmate.Filter
    @schema: schema

    process: (asset, options, cb) ->
      if _.isFunction(options._args)
        fn = options._args
      else
        fn = options.command
      return cb("Options.command is required and must be a function(asset, options[, cb])") unless typeof fn == "function"

      try
        if fn.length == 3
          fn asset, options, cb
        else
          fn asset, options
          cb()
      catch ex
        cb ex


