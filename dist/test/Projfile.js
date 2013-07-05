/**
 * Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
 *
 * See the file LICENSE for copying permission.
 */

exports.project = function(pm) {
  var $, f;
  f = pm.f, $ = pm.$;
  return {
    testCommonJs: {
      files: 'res/commonJs/**/*.js',
      dev: [
        f.commonJs({
          name: 'apackage',
          root: 'res/commonJs',
          filename: 'tmp/apackage.js',
          requireProp: 'brequire',
          auto: 'index',
          include: 'res/commonJs/standalone.js'
        }), f.writeFile
      ]
    },
    stylus: {
      files: 'res/style.styl',
      dev: [
        f.stylus, f.writeFile({
          _filename: 'tmp/stylus.css'
        })
      ]
    }
  };
};
