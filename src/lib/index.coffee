##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

Fs = require("fs")
Path = require("path")

# Avoid manual updating of exports dictionary.
for file in Fs.readdirSync(__dirname)
  basename = Path.basename(file, Path.extname(file))
  continue if basename == "index"
  exports[basename] = require("./#{basename}")


# Aliases
exports['writeFile'] = require("./writeFiles")
