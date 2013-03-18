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
  class LoadFilenames extends TaskProcessor
    extnames: "*"

    ##
    # Directly manipulates a task such as its assets property.
    #
    process: (task, options, cb) ->
      log = @log
      cwd = process.cwd()
      patterns = task.config.files.include
      excludePatterns = task.config.files.exclude

      PmUtils.glob patterns, excludePatterns, {nosort: true}, (err, files) ->
        return cb(err) if err

        assets = []
        assets.create = (opts) ->
          assets.push new FileAsset(filename: opts.filename, text: opts.text, cwd: cwd, parent: assets)
        assets.clear = (opts) ->
          assets.length = 0

        if files.length > 0
          for file in files
            stat = Fs.statSync(file)
            assets.create filename: file, text: "", stat: stat

          task.assets = assets
          cb()
        else
          cb "No files found: " + Util.inspect(patterns)

