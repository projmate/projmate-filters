var eventBus;

eventBus = require("../../helper").eventBus;

describe("globalTest", function() {
  global.foo = "bar";
  it("should write to file", function() {
    return eventBus.emit('mochaping', "c1");
  });
  return it("should write to file 2", function(done) {
    eventBus.emit('mochaping', "c2");
    return done();
  });
});


/*
//@ sourceMappingURL=cGlobalTest.map
*/