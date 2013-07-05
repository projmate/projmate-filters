##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

_ = require("lodash")
path = require("path")


module.exports = (Projmate) ->
  stylus = require('stylus')

  schema =
    title: 'Compiles Stylus CSS'
    type: 'object'
    properties:
      linenos:
        type: 'boolean'
        description: 'Reference source line numbers in compiled CSS'
      paths:
        type: 'array'
        items:
          type: 'string'
        description: 'Paths to include'
      compress:
        type: 'boolean'
        description: 'Whether to compress the output CSS'
      defines:
        type: 'object'
        description: 'Key-value pairs to define'
      nib:
        type: 'boolean'
        description: 'Enables nib support'
      imports:
        type: 'array'
        description: 'Assets to import'
        items:
          type: 'string'
      plugins:
        type: 'array'
        description: 'Plugins to use'
        items:
          type: 'string'

    __:
      extnames: ".styl"
      outExtname: ".css"
      defaults:
        development: {linenos: true, compress: false}
        production: {linenos: false, compress: true}


  # Compiles a less buffer.
  class Stylus extends Projmate.Filter
    @schema: schema

    process: (asset, options, cb) ->
      # css - reverse compiles to stylus

      if !options.paths?
        options.paths = [asset.dirname]

      renderer = stylus(asset.text, {filename: asset.filename})
      if options.defines?
        for k, v of options.defines
          renderer.define k, v
      if options.paths?
        for path of options.paths
          renderer.include path
      if options.imports?
        for path of options.imports
          renderer.import path
      if options.plugins?
        for plugin of options.plugins
          renderer.use Plugin
      if options.nib
        nib = require('nib')
        renderer.use nib()

      renderer.render cb
