'use strict';

const expect = require('chai').expect;

// Create the variable you are going to test
let p5js = 'awesome';

// describe lets you comment on what this block of code is for.
describe('Testing number of restarts', function() {

  // it() lets you comment on what an individual test is about.
  it('should be a string', function(done) {
    // expect is the actual test.  This test checks if the var is a string.
    expect(p5js).to.be.a('string');
    // done tells the program the test is complete.
    done();
  });

  it('should be equal to awesome', function(done) {
    // This expect tests the value of the string.
    expect(p5js).to.equal('awesome');
    done();
  });
});