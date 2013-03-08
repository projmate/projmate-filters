Fs = require("fs")
Path = require("path")

for file in Fs.readdirSync(__dirname)
  basename = Path.basename(file, Path.extname(file))
  continue if basename == "index"
  exports[basename] = require("./#{basename}")
