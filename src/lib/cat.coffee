##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

module.exports = (Projmate) ->
  {TaskProcessor} = Projmate

  schema =
    title: 'Concatenates files'
    properties:
      join:
        type: "String"
        description: "The string to join with"
    __:
      extnames: "*"

  class Cat extends TaskProcessor
    @schema: schema

    # Concatenate all assets to a single asset.
    #
    # @param {Task} task
    # @param {Object} options = {
    #   {String} [join] Join string.
    #   {String} filename Output filename.
    # }
    #
    process: (task, options, cb) ->
      return cb() if task.assets.isEmpty()

      join = options.join || ""
      filename = options.filename

      script = ""
      first = true
      task.assets.each (asset) ->
        if join.length > 0 and not first
          script += join
        script += asset.text
        first = false
        true # each() iterator needs this to continue

      # File contents were concatenated, change assets to single asset
      task.assets.clear()
      task.assets.create filename: filename, text: script
      cb()

