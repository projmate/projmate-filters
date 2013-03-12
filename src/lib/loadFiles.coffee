# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.
#

{glob} = require("multi-glob")
Async = require("async")
Fs = require("fs")
Util = require("util")


module.exports = (Projmate) ->
  {FileAsset, TaskProcessor, Utils:PmUtils} = Projmate

  # Loads files based on a task's `_files` property.
  #
  # This is usually invoked as the first filter of a pipeline.
  #
  class LoadFiles extends TaskProcessor
    extnames: "*"

    # Directly manipulates a task such as its assets property.
    #
    process: (task, options, cb) ->
      log = @log
      cwd = process.cwd()
      patterns = task.config._files.include

      glob patterns, {nosort: true}, (err, files) ->
        return cb(err) if err

        assets = []
        assets.create = (opts) ->
          assets.push new FileAsset(filename: opts.filename, text: opts.text, cwd: cwd, parent: assets)
        assets.clear = (opts) ->
          assets.length = 0

        if files.length > 0
          Async.eachSeries files, (file, cb) ->

            # Ignore directories
            # TODO performance issues by stating each file?
            stat = Fs.statSync(file)
            return cb() if stat.isDirectory()

            # ignore binary files for now!?
            return cb() if PmUtils.isFileBinary(file)

            Fs.readFile file, "utf8", (err, text) ->
              return cb(err) if err
              assets.create filename: file, text: text
              cb()
          , (err) ->
            task.assets = assets
            cb()
        else
          cb "No files found: " + Util.inspect(patterns)

