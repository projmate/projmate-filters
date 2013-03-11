# This is needed since Projmate may be unstable while developing and
# would not be able to build itself, but it's good to stand on the shoulder
# of giants.

$ = require("projmate-shell")

task "build", "Builds the project", ->
  $.rm "-rf", "dist"
  $.coffee "-c -o dist src", (err) ->
    return console.error(err) if err
    $.cp "-f", "src/lib/*.js", "dist/lib"
    $.mkdir "-p", "dist/support"
    $.cp "-f", "src/support/*.js", "dist/support"

task "test", "Runs tests", ->
  $.run "mocha --compilers coffee:coffee-script src/test"

