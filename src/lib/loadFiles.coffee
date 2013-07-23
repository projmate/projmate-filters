##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Async = require("async")
Fs = require("fs")
Util = require("util")
_ = require("lodash")


schema =
  title: 'Loads file using task patterns and creates FileAsset(s)'
  type: 'object'

  __:
    extnames: "*"
    isAssetLoader: true

module.exports = (Projmate) ->
  {FileAsset, TaskProcessor, Utils:PmUtils} = Projmate

  ##
  # Loads files based on a task's `files` property.
  #
  # This is usually invoked as the first filter of a pipeline.
  #
  class LoadFiles extends TaskProcessor
    @schema: schema

    # Directly manipulates a task such as its assets property.
    #
    process: (task, options, cb) ->
      log = @log
      cwd = process.cwd()

      # _args mean user passed in a single argument
      if options._args
        options.include = options._args

      if options.include
        files = {include: options.include, exclude: options.exclude}
        PmUtils.normalizeFiles {files}, 'files'
      else
        files = task.config.files

      patterns = files.include
      excludePatterns = files.exclude
      {assets} = task

      PmUtils.glob patterns, excludePatterns, {nosort: true}, (err, files) ->
        if err
          log.error "patterns: #{patterns} #{excludePatterns}"
          return cb(err)

        if !files || files.length == 0
          return cb("No files match: #{patterns} #{excludePatterns}")

        if files.length > 0
          Async.eachSeries files, (file, cb) ->
            if file.indexOf("./") == 0 || file.indexOf(".\\") == 0
              file = file.slice(2)

            # Ignore directories
            # TODO performance issues by stating each file?
            Fs.stat file, (err, stat) ->
              return cb(err) if err
              return cb() if stat.isDirectory()

              # ignore binary files for now!?
              if PmUtils.isFileBinary(file)
                log.debug "Ignoring binary file: #{file}"
                return cb()

              Fs.readFile file, "utf8", (err, text) ->
                return cb(err) if err
                assets.create filename: file, text: text, stat: stat, cwd: cwd
                cb()
          , cb # async eachSeries
        else
          cb "No files found: " + Util.inspect(patterns)

