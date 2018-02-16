// tslint:disable

import * as assert from 'assert'

import md5 from './md5'

describe('helpers/md5()', function() {
  it('SHOULD return the expected result', function() {
    assert.strictEqual(md5('myemailaddress@example.com'), '0bc83cb571cd1c50ba6f3e8a78ef1346')
  })
})
