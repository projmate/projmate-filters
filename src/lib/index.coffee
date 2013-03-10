Fs = require("fs")
Path = require("path")

# Avoid manual updating of exports dictionary.
for file in Fs.readdirSync(__dirname)
  basename = Path.basename(file, Path.extname(file))
  continue if basename == "index"
  exports[basename] = require("./#{basename}")


# Aliases
exports['writeFile'] = require("./writeFiles")
