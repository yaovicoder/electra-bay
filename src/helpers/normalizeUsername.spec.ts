// tslint:disable

import * as assert from 'assert'

import normalizeUsername from './normalizeUsername'

describe('helpers/normalizeUsername()', function() {
  it('SHOULD return the expected result', function() {
    assert.strictEqual(normalizeUsername('-`aAb\'c"d_e fèg/h-iÈ-\\'), 'abcdefgh-i')
  })
})
