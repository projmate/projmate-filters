##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
# # See the file LICENSE for copying permission.

_ = require ("lodash")
Path = require("path")
Fs = require('fs')

module.exports = (Projmate) ->
  {Filter, Utils} = Projmate

  schema =
    title: 'Compiles TypeScript to JavaScript'
    type: 'object'

    __:
      extnames: [".ts"]
      outExtname: ".js"
      defaults:
        # source maps are a good thing in development but not yet fully tested
        development: {sourceMap: false}
        production: {sourceMap: false}

  # lazy load this stuff
  lib_d_ts = null
  TypeScript = null

  # Compiles CoffeeScript to JavaScript.
  #
  class TypeScript extends Filter
    @schema: schema

    constructor: ->
      lib_d_ts ?= Fs.readFileSync(Path.resolve(__dirname + '/../../node_modules/typescript/bin/lib.d.ts'), 'utf8')
      TypeScript ?= require('typescript')

    process: (asset, options, cb) ->
      outfile:
        source: ''
        Write: (s) ->
          @source += s
        WriteLine: (s) ->
          @source += s + '\n'
        Close: ->

      try
        compiler = new TypeSript.TypeScriptCmpiler(outfile)
        compiler.parser.errorRecovery = true
        compiler.setErrorCallback (start, len, message, block) ->
            console.error 'Compilation error: ', message, '\n Code block: ', block, ' Start position: ', start, ' Length: ', len
        compiler.addUnit lib_d_ts, 'lib.d.ts'
        console.error 'lib_d_ts', lib_d_ts
        compiler.addUnit asset.text, asset.filename
        compiler.typeCheck()
        compiler.emit false, (filename) ->
          return outfile
        js = outfile.source
        cb null,  js
      catch err
        cb err

