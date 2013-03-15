copyright = """
/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */
\n
"""

exports.project = (pm) ->
  f = pm.filters()
  $ = pm.shell()

  #  "src/**/*" => "dist/**/*"
  toDist = _filename: {replace: [/^src/, "dist"]}

  pm.registerTasks
    build:
      pre: "clean"
      desc: "Compiles source files"
      files: "src/**/*"

      development: [
        f.coffee(bare: true)
        f.addHeader(text: copyright)
        f.writeFiles(toDist)
      ]

    tests:
      files:
        load: false
        include: "src/test/**/*Spec*"

      development: (cb) ->
        $.run "mocha --compilers coffee:coffee-script src/test", cb

    clean:
      development: ->
        $.rm_rf "dist"

    dist:
      pre: ["tests", "build"]

