# Needed at times since Projmate may be unstable while developing.
$ = require("projmate-shell")

task "build", "Builds the project", ->
  $.rm "-rf", "dist"
  $.coffee "-c -o dist src", (err) ->
    return console.error(err) if err
    $.cp_f "src/lib/*.js", "dist/lib"
    $.mkdir "-p", "dist/support"
    $.cp_rf "src/support/*", "dist/support"

task "test", "Runs tests", ->
  $.run "mocha --compilers coffee:coffee-script src/test"

