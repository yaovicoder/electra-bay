// tslint:disable

import * as assert from 'assert'

import slugify from './slugify'

describe('helpers/slugify()', function() {
  it('SHOULD return the expected result', function() {
    assert.strictEqual(slugify('`A\'b"c_d eèf/g\\'), 'a-b-c-d-e-f-g')
  })
})
