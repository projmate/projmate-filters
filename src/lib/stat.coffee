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
    extnames: "*"
    isAssetLoader: true

    ##
    # Directly manipulates a task such as its assets property.
    #
    process: (task, options, cb) ->
      log = @log
      cwd = process.cwd()
      patterns = task.config.files.include
      excludePatterns = task.config.files.exclude
      {assets} = task

      PmUtils.glob patterns, excludePatterns, {nosort: true}, (err, files) ->
        return cb(err) if err

        if files.length > 0
          for file in files
            stat = Fs.statSync(file)
            assets.create filename: file, text: "", stat: stat, cwd: cwd
          cb()
        else
          cb "No files found: " + Util.inspect(patterns)

