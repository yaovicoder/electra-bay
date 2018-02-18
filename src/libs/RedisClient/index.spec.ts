// tslint:disable

import * as assert from 'assert'

import assertCatch from '../../helpers/assertCatch'

function waitFor(inMs: number) {
  return new Promise(resolve => setTimeout(resolve, inMs))
}

describe('RedisClient', function() {
  let redisClient

  before(function() {
    const RedisClient = require('.')
    redisClient = new RedisClient()
  })

  after(function() {
    redisClient.client.quit()
  })

  describe('#cache()', function() {
    it('SHOULD be undefined', async function() {
      assert.strictEqual(await redisClient.cache('testUndefined'), undefined)
    })

    it('SHOULD save and retrieve a TRUE boolean', async function() {
      assert.strictEqual(await assertCatch(() => redisClient.cache('boolean', true, 1)), false)
      assert.strictEqual(await redisClient.cache('boolean'), true)
    })

    it('SHOULD save and retrieve a FALSE boolean', async function() {
      assert.strictEqual(await assertCatch(() => redisClient.cache('boolean', false, 1)), false)
      assert.strictEqual(await redisClient.cache('boolean'), false)
    })

    it('SHOULD save and retrieve a number', async function() {
      assert.strictEqual(await assertCatch(() => redisClient.cache('number', 12345.67890, 1)), false)
      assert.strictEqual(await redisClient.cache('number'), 12345.67890)
    })

    it('SHOULD save and retrieve an object', async function() {
      const obj = { obj: { foo: 'bar' }, arr: ['foo', 'bar'], nbr: 12345.6789, str: 'foo', true: true, false: false }
      assert.strictEqual(await assertCatch(() => redisClient.cache('object', obj, 1)), false)
      assert.deepEqual(await redisClient.cache('object'), obj)
    })

    it('SHOULD save and retrieve an array', async function() {
      const arr = [{ foo: 'bar' }, ['foo', 'bar'], 12345.6789, 'foo', true, false]
      assert.strictEqual(await assertCatch(() => redisClient.cache('array', arr, 1)), false)
      assert.deepEqual(await redisClient.cache('array'), arr)
    })

    it('SHOULD save and retrieve an string', async function() {
      assert.strictEqual(await assertCatch(() => redisClient.cache('string', 'foo bar', 1)), false)
      assert.strictEqual(await redisClient.cache('string'), 'foo bar')
    })

    it('SHOULD disappear after 1 second', async function() {
      assert.strictEqual(await assertCatch(() => redisClient.cache('string', 'John Doe', 1)), false)
      await waitFor(1000)
      assert.strictEqual(await redisClient.cache('string'), undefined)
    })

    it('SHOULD save and retrieve null', async function() {
      assert.strictEqual(await assertCatch(() => redisClient.cache('null', null, 1)), false)
      assert.strictEqual(await redisClient.cache('null'), null)
    })

    it('SHOULD save and retrieve undefined', async function() {
      assert.strictEqual(await assertCatch(() => redisClient.cache('undefined', undefined, 1)), false)
      assert.strictEqual(await redisClient.cache('undefined'), undefined)
    })

    it('SHOULD fail with a function', async function() {
      assert.strictEqual(await assertCatch(() => redisClient.cache('function', waitFor, 1)), true)
    })
  })
})
