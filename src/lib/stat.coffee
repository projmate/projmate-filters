##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Async = require("async")
Fs = require("fs")
Util = require("util")


module.exports = (Projmate) ->
  {FileAsset, TaskProcessor, Utils:PmUtils} = Projmate

  # Loads files based on a task's `files` property.
  #
  # This is usually invoked as the first filter of a pipeline.
  #
  class Stat extends TaskProcessor

    @schema:
      title: 'Load asset stats only, not text'
      type: 'object'
      __:
        extnames: "*"
        isAssetLoader: true
        examples: [
          title: 'Process filenames without loading their content'
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
      cwd = process.cwd()
      patterns = task.config.files.include
      excludePatterns = task.config.files.exclude
      {assets} = task

      PmUtils.glob patterns, excludePatterns, {nosort: true}, (err, files) ->
        return cb(err) if err

        if files.length > 0
          # Need to process files in order
          Async.eachSeries files, (file, cb) ->
            Fs.stat file, (err, stat) ->
              return cb(err) if err
              assets.create filename: file, text: "", stat: stat, cwd: cwd
              cb()
          , cb
        else
          cb "No files found: " + Util.inspect(patterns)

