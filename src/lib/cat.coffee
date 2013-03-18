##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

module.exports = (Projmate) ->
  {TaskProcessor} = Projmate

  class Cat extends TaskProcessor
    extnames: "*"

    # Concatenate all assets to a single asset.
    #
    # @param {Task} task
    # @param {Object} options = {
    #   {String} [join] Join string.
    #   {String} filename Output filename.
    # }
    #
    process: (task, options, cb) ->
      return cb() if task.assets.length < 1

      join = options.join || ""
      filename = options.filename

      script = ""
      first = true
      for asset in task.assets
        if join.length > 0 and not first
          script += join
        script += asset.text
        first = false

      # File contents were concatenated, change assets to single asset
      cwd = task.assets[0].cwd
      task.assets.clear()
      task.assets.create filename: filename, text: script
      cb()

