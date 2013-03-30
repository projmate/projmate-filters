/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

var Fs, Path, basename, file, _i, _len, _ref;

Fs = require("fs");

Path = require("path");

_ref = Fs.readdirSync(__dirname);
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  file = _ref[_i];
  basename = Path.basename(file, Path.extname(file));
  if (basename === "index") {
    continue;
  }
  if (Fs.statSync("" + __dirname + "/" + file).isDirectory()) {
    continue;
  }
  exports[basename] = require("./" + basename);
}

exports["writeFile"] = require("./writeFiles");

exports["commonJs"] = require("./commonJsify");

exports["fn"] = require("./functoid");
