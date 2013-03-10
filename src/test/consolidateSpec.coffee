{assert, Assertion} = require("chai")
Assertion.includeStack = true

factory = require("../lib/template")
Projmate = require("projmate-core/dist")
{FileAsset} = Projmate
Template = factory(Projmate)

textAsset = (text) ->
  new FileAsset(filename: "notused.html", text: text, parent: [])


describe "template", ->

  describe "underscore", ->
    it "should render as the default with no engine specified", (done) ->
      asset = textAsset("<div><%=name%></div>")
      pp = new Template
      pp.process asset, {name: "foo"}, (err, result) ->
        assert.ifError err
        assert.equal result, "<div>foo</div>"
        done()







