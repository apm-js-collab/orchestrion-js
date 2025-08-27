'use strict'

module.exports = Foo

function Foo() {}

Foo.prototype.doWork = function doWork(input, callback) {
  if (input === 'fail') {
    return callback(Error('boom'))
  }
  return callback(null, 'done')
}