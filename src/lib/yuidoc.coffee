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

  Y = require('yuidocjs')

  # Loads files based on a task's `files` property.
  #
  # This is usually invoked as the first filter of a pipeline.
  #
  class Yuidoc extends TaskProcessor

    @schema:
      title: 'Creates documentation from source.'
      type: 'object'
      __:
        extnames: "*"
        useLoader: 'stat'
        defaults:
          quiet: true
        examples: [
          title: 'Create documentation from dist folder'
          text:
            """
            dev: [
              f.stat,
              f.tap(function(asset) {
                // log properties of asset, asset.text === ''
                console.dir(asset);
              })
            ]
            """
        ]


    ##
    # Directly manipulates a task such as its assets property.
    #
    process: (task, options, cb) ->
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
