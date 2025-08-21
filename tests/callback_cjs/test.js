'use strict'

const assert = require('node:assert')
const { getContext } = require('../common/preamble.js');
const context = getContext('orchestrion:foo:foo_ch');
const Foo = require('./instrumented.js')

const start = process.hrtime.bigint()
const timer1 = setInterval(timeout, 1_000)
const timer2 = setInterval(timeout, 1_000)
const foo = new Foo()

foo.doWork('success', (error, result) => {
  assert.equal(error, undefined)
  assert.equal(result, 'done')

  assert.deepStrictEqual(context, {
    start: true
  })
  delete context.start

  clearInterval(timer1)
})

foo.doWork('fail', (error, result) => {
  assert.equal(error.message, 'boom')
  assert.equal(undefined, result)

  assert.deepStrictEqual(context, {
    end: true,
    start: true
  })
  delete context.end
  delete context.start

  clearInterval(timer2)
})

function timeout() {
  const current = process.hrtime.bigint()
  if ((current - start) > 3e+10) {
    // Exceeded 30 seconds, terminate it all.
    clearInterval(timer1)
    clearInterval(timer2)
  }
}
