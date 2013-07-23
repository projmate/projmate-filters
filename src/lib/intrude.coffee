##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

_ = require('lodash')

module.exports = (Projmate) ->
  schema =
    title: 'Run a custom command'
    type: 'object'
    properties:
      command:
        description: '(assets, options) or (assets, options, cb)'
        type: 'function'

    __:
      extnames: '*'
      examples: [
        title: 'Remove a temporary file generated by this task',
        text:
          """
          f.intrude(function() {
            $.rm('-f', 'unwanted-file');
          })
          """
      ]

  ##
  # Runs custom processing once in a pipeline (enforced by task object).
  #
  class Once extends Projmate.Filter
    @schema: schema

    process: (task, options, cb) ->
      if _.isFunction(options._args)
        fn = options._args
      else
        fn = options.command
      return cb("Options.command is required and must be a function(asset, options[, cb])") unless typeof fn == "function"

      try
        if fn.length == 3
          fn task, options, cb
        else
          fn task, options
          cb()
      catch ex
        cb ex


