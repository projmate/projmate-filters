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





