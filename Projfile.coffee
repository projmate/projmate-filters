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
  toDist = filename: {replace: [/^src/, "dist"]}

  pm.registerTasks
    build:
      _desc: "Compiles source files"
      _files:
        include: [
          "src/**/*"
        ]

      development: [
        f.coffee(bare: true)
        f.addHeader(text: copyright)
        f.writeFiles($asset: toDist)
      ]

    tests:
      _files:
        load: false
        include: [
          "src/test/**/*Spec*"
        ]

      development: (cb) ->
        $.run "mocha --compilers coffee:coffee-script src/test", cb
