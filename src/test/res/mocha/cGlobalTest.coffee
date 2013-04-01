{eventBus} = require("../../helper")

describe "globalTest", ->
  global.foo = "bar"
  it "should write to file", ->
    eventBus.emit 'mochaping', "c1"

  it "should write to file 2", (done) ->
    eventBus.emit 'mochaping', "c2"
    done()
