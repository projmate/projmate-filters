var eventBus;

eventBus = require("../../helper").eventBus;

describe("aSpec", function() {
  it("should write to file", function() {
    return eventBus.emit('mochaping', "a1");
  });
  return it("should write to file 2", function(done) {
    eventBus.emit('mochaping', "a2");
    return done();
  });
});


/*
//@ sourceMappingURL=aSpec.map
*/