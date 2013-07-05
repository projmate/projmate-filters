##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

cons = require("consolidate")

module.exports = (Projmate) ->


  schema =
    title: 'Runs consolidate templates [deprecating]'
    type: 'obj'
    __:
      extnames: "*"
      outExtname: ".html"

  # Compiles many types of templates to HTML using consolidate.
  #
  class Template extends Projmate.Filter
    @schema: schema

    process: (asset, options, cb) ->
      engine = options.engine || "underscore"
      if options.requires
        require options.requires

      if !cons[engine].render
        return cb("Unknown template engine: #{options.engine}")
      try
        cons[engine].render asset.text, options, cb
      catch ex
        cb ex
