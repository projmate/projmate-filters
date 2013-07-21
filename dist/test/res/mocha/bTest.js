var eventBus = require("../../helper").eventBus;

describe("aTest", function() {
  it("should write to file", function() {
    eventBus.emit('mochaping', "b1");
  });
  it("should write to file 2", function(done) {
    eventBus.emit('mochaping', "b2");
    done();
  });
});
