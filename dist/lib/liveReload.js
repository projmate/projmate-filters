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
    Projmate.Filter.apply(this, arguments);
  }
  Projmate.extendsFilter(LiveReload);


  /**
   * For the UI.
   */
  LiveReload.schema = {
    title: "Adds LiveReload2 header to HMTL pages",
    type: 'object',

    properties: {
      port: {
        type: "Integer",
        default: 1080,
        description: "Specify the port the server should listen to",
        validate: function(n) { return n > 0; }
      },

      domain: {
        type: "String",
        default: "local.projmate.com",
        description: "The domain to use."
      }
    },

    __: {
      extnames: '.html'
    }
  };

  LiveReload.prototype.process = function(asset, options, cb) {
    var domain = options.domain || "local.projmate.com";
    var port = options.port || 1080;
    cb(null,
      asset.text.replace("</head>", "<script src=\"http://"+domain+":"+port+"/livereload.js\"></script></head>")
    );
  };


  return LiveReload;
};
