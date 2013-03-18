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

    addHeaders:
      desc: "Adds header to source files"
      files: [
        "src/lib/**/*.{coffee,js}"
        "src/test/**/*.{coffee,js}"
        "src/index.coffee"
      ]
      development: [
        f.addHeader(filename: "doc/copyright.coffee", $if: {extname: ".coffee"})
        f.addHeader(filename: "doc/copyright.js", $if: {extname: ".js"})
        f.writeFile
      ]

    updateJsBeautify:
      desc: "Updates from https://github.com/einars/js-beautify"
      development: ->
        # or master
        commit = "0088ff13552f269240016ac5cbfbaf88b8449c1b"
        root = "https://raw.github.com/einars/js-beautify/#{commit}"
        files = [
          "beautify-css.js"
          "beautify-html.js"
          "beautify.js"
        ]

        $.mkdir_p "src/support/js-beautify"

        for file in files
          url = "#{root}/#{file}"
          $.run "curl -o src/support/js-beautify/#{file} #{url}"

