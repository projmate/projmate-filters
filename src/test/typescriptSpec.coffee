{assert, textAsset, Filter} = require("./helper")

filter = Filter("../lib/typescript")
describe "TypeSript", ->

  it "should handle simple typescript", (done) ->
    asset = textAsset """
      interface Person {
          firstname: string;
          lastname: string;
      }

      function greeter(person : Person) {
          return "Hello, " + person.firstname + " " + person.lastname;
      }

      var user = {firstname: "Jane", lastname: "User"};
    """

    filter.process asset, {bare: true}, (err, result) ->
      console.log "result", result
      done()

  # it "should create sourcemaps", (done) ->
  #   asset = textAsset("a=1")
  #   assets = asset.parent
  #   assert.equal asset.parent.size(), 1

  #   coffee.process asset, {bare: true, sourceMap: true, $inspect: true}, (err, result) ->
  #     assert.ifError err
  #     # should have a javascript asset and map asset
  #     assert.equal assets.size(), 2
  #     assert.isTrue result.indexOf("sourceMappingURL=notused.map") > 0
  #     assert.isTrue assets.at(1).text.indexOf('"mappings"') > 0
  #     assert.equal assets.at(1).extname, ".map"
  #     done()
