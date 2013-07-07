exports.project = (pm) ->
  {f, $} = pm

  testCommonJs:
    files: 'res/commonJs/**/*.js'
    dev: [
      f.commonJs
        name: 'apackage'
        root: 'res/commonJs'
        filename: 'tmp/apackage.js'
        requireProp: 'brequire'
        auto: 'index'
        include: 'res/commonJs/standalone.js'
      f.writeFile
    ]

  stylus:
    files: 'res/style.styl'
    dev: [
      f.stylus
      f.writeFile _filename: 'tmp/stylus.css'
    ]

  tapper:
    files: 'res/style.styl'
    dev: [
      f.tap foo: 'bar', command: (asset, options) ->
        console.log options.foo
    ]






