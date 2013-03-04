##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.
#

{glob} = require("multi-glob")
Async = require("async")
Fs = require("fs")
Util = require("util")


module.exports = (Projmate) ->

  ##
  # Loads files based on a task's `_files` property.
  #
  # This is usually invoked as the first filter of a pipeline.
  #
  class LoadFiles extends Projmate.TaskProcessor
    extnames: "*"

    ##
    # Directly manipulates a task such as its assets property.
    #
    process: (task, options, cb) ->
      log = @log
      cwd = process.cwd()
      patterns = task.config._files.include

      glob patterns, {nosort: true}, (err, files) ->
        return cb(err) if err

        assets = []
        if files.length > 0
          Async.eachSeries files, (file, cb) ->
            Fs.readFile file, "utf8", (err, text) ->
              return cb(err) if err
              asset = new Projmate.FileAsset(filename: file, cwd: cwd, text: text)
              assets.push asset
              cb()
          , (err) ->
            task.assets = assets
            cb()
        else
          cb "No files found: " + Util.inspect(patterns)
