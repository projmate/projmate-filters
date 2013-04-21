exports.project = (pm) ->
  {f, $} = pm

  testCommonJs:
    files: 'res/commonJs/**/*.js'
    dev: [
      f.cjs
        name: 'apackage'
        root: 'res/commonJs'
        filename: 'tmp/apackage.js'
        requireProp: 'brequire'
        auto: 'index'
      f.writeFile
    ]


