# This is needed since Projmate may be unstable while developing and
# would not be able to build itself, but it's good to stand on the shoulder
# of giants.

sh = require("projmate-shell")

task "build", "Builds the project", ->
  sh.rm "-rf", "dist"
  sh.coffee "-c -o dist src", (err) ->
    return console.error(err) if err
    sh.cp "-f", "src/lib/*.js", "dist/lib"

