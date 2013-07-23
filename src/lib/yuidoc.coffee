##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Async = require("async")
Fs = require("fs")
Util = require("util")
_ = require('lodash')


module.exports = (Projmate) ->
  {FileAsset, TaskProcessor, Utils:PmUtils} = Projmate

  # Loads files based on a task's `files` property.
  #
  # This is usually invoked as the first filter of a pipeline.
  #
  class Yuidoc extends TaskProcessor

    @schema:
      title: 'Creates API docs from source.'
      type: 'object'
      properties:
        outdir:
          type: 'string'
          description: 'Output directory'
      __:
        extnames: "*"
        useLoader: 'stat'
        defaults:
          dev:
            quiet: true
        examples: [
          title: 'Create documentation from dist folder'
          text:
            """
            docs: {
              files: 'src/docs',
              dev: [
                f.yuidoc({outdir: 'dist/docs'})
              ]
            }
            """
        ]


    ##
    # Directly manipulates a task such as its assets property.
    #
    process: (task, options, cb) ->
      Y = require('yuidocjs')

      {assets} = task

      dirnames = assets.pluck('_dirname')
      if !dirnames?.length > 0
        return cb('directory not found')
      options.paths = _.unique(dirnames)
      json = (new Y.YUIDoc(options)).run()
      options = Y.Project.mix(json, options)

      if options.parseOnly
        cb()
      else
        builder = new Y.DocBuilder(options, json)
        builder.compile cb
