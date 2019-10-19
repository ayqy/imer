const { produce } = require('../../dist/umd/index');
const assert = require('assert');
const clone = require('clone');


module.exports = function runCase(original, producer) {
  // Actual value
  const actual = produce(original, producer);
  // Expected value
  const expected = clone(original);
  producer(expected);
  // Actual should strictly deepEqual expected
  try {
    assert.deepStrictEqual(actual, expected);
  } catch (error) {
    console.log(error);
    console.log(Object.getPrototypeOf(actual));
    console.log(Object.getPrototypeOf(expected));
  }
  // Original should not be modified
  assert.deepStrictEqual(original, clone(original));

  return actual;
};
