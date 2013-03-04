var Path = require("path");

module.exports = function(Projmate) {
  function WriteFile() {
    this.extnames = "*";
    Projmate.Filter.apply(this, arguments);
  }
  Projmate.extendsFilter(WriteFile);

  WriteFile.prototype.process = function(asset, options, cb) {
    var filename = asset.filename;

    // chomp off leading string
    if (options.lchomp) {
      if (filename.indexOf(options.lchomp) === 0) {
        filename = filename.slice(options.lchomp.length);
      }
      if (filename[0] === "/") {
        filename = filename.slice(1);
      }
    }

    // set destinationdir
    if (options.destinationDir) {
      filename = Path.join(options.destinationDir, filename);
    }

    asset.write(filename, cb);
  };

  return WriteFile;

};
