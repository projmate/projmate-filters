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
    },
    tapper: {
      files: 'res/style.styl',
      dev: [
        f.tap({
          foo: 'bar',
          command: function(asset, options) {
            return console.log(options.foo);
          }
        })
      ]
    }
  };
};


/*
//@ sourceMappingURL=Projfile.map
*/