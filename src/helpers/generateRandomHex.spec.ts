// tslint:disable

import * as assert from 'assert'

import generateRandomHex from './generateRandomHex'

describe('helpers/generateRandomHex()', function() {
  it('SHOULD return a lowercase hexadecimal string', function() {
    assert.strictEqual(/^[a-f0-9]+$/.test(generateRandomHex()), true)
  })

  it('SHOULD return a 64 characters long string by default', function() {
    assert.strictEqual(generateRandomHex().length, 64)
  })

  it('SHOULD return a string with the expected length', function() {
    assert.strictEqual(generateRandomHex(128).length, 128)
  })
})
