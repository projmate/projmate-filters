/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

module.exports = function(Projmate) {

  /**
   * Adds live reload header to HTML files.
   */
  function LiveReload() {
    this.extnames = ".html";
    Projmate.Filter.apply(this, arguments);
  }
  Projmate.extendsFilter(LiveReload);


  /**
   * For the UI.
   */
  LiveReload.meta = {
    _: {
      description: "Adds [LiveReload2]() header to HTML files which notifies pages of asset changes",
      example: "liveReload({port: 1080})",
      extnames: [".html"],
    },

    port: {
      type: "Integer",
      default: 1080,
      description: "Specify the port the server should listen to",
      validate: function(n) { return n > 0; }
    },

    domain: {
      type: "String",
      default: "0.0.0.0",
      description: "The domain to use."
    }
  };

  LiveReload.prototype.process = function(asset, options, cb) {
    var domain = options.domain || "0.0.0.0";
    var port = options.port || 1080;
    cb(null,
      asset.text.replace("</head>", "<script src=\"http://"+domain+":"+port+"/livereload.js\"></script></head>")
    );
  };


  return LiveReload;
};
