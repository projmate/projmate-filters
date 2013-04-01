{eventBus} = require("../../helper")

describe "aSpec", ->
  it "should write to file", ->
    eventBus.emit 'mochaping', "a1"

  it "should write to file 2", (done) ->
    eventBus.emit 'mochaping', "a2"
    done()
