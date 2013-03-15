# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.
#

Async = require("async")
Fs = require("fs")
Util = require("util")
_ = require("lodash")


module.exports = (Projmate) ->
  {FileAsset, TaskProcessor, Utils:PmUtils} = Projmate

  # Loads files based on a task's `files` property.
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
      patterns = task.config.files.include
      excludePatterns = task.config.files.exclude

      PmUtils.glob patterns, excludePatterns, {nosort: true}, (err, files) ->
        if err
          console.error "patterns: #{patterns} #{excludePatterns}"
          return cb(err)

        if !files || files.length == 0
          return cb("No files match: #{patterns} #{excludePatterns}")

        assets = []
        assets.create = (opts) ->
          assets.push new FileAsset
            filename: opts.filename
            text: opts.text,
            cwd: cwd
            parent: assets
            stat: opts.stat
        assets.clear = (opts) ->
          assets.length = 0

        if files.length > 0
          Async.eachSeries files, (file, cb) ->

            # Ignore directories
            # TODO performance issues by stating each file?
            stat = Fs.statSync(file)
            return cb() if stat.isDirectory()

            # ignore binary files for now!?
            if PmUtils.isFileBinary(file)
              return cb()

            Fs.readFile file, "utf8", (err, text) ->
              return cb(err) if err
              assets.create filename: file, text: text, stat: stat
              cb()
          , (err) ->
            task.assets = assets
            cb()
        else
          cb "No files found: " + Util.inspect(patterns)

