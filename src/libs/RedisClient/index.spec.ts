// tslint:disable

import * as assert from 'assert'

import RedisClient from '.'
import assertCatch from '../../helpers/assertCatch'

function waitFor(inMs: number) {
  return new Promise(resolve => setTimeout(resolve, inMs))
}

describe('RedisClient', function() {
  describe('#cache()', function() {
    it('SHOULD be undefined', async function() {
      assert.strictEqual(await RedisClient.cache('testUndefined'), undefined)
    })

    it('SHOULD save and retrieve a TRUE boolean', async function() {
      assert.strictEqual(await assertCatch(() => RedisClient.cache('boolean', true, 1)), false)
      assert.strictEqual(await RedisClient.cache('boolean'), true)
    })

    it('SHOULD save and retrieve a FALSE boolean', async function() {
      assert.strictEqual(await assertCatch(() => RedisClient.cache('boolean', false, 1)), false)
      assert.strictEqual(await RedisClient.cache('boolean'), false)
    })

    it('SHOULD save and retrieve a number', async function() {
      assert.strictEqual(await assertCatch(() => RedisClient.cache('number', 12345.67890, 1)), false)
      assert.strictEqual(await RedisClient.cache('number'), 12345.67890)
    })

    it('SHOULD save and retrieve an object', async function() {
      const obj = { obj: { foo: 'bar' }, arr: ['foo', 'bar'], nbr: 12345.6789, str: 'foo', true: true, false: false }
      assert.strictEqual(await assertCatch(() => RedisClient.cache('object', obj, 1)), false)
      assert.deepEqual(await RedisClient.cache('object'), obj)
    })

    it('SHOULD save and retrieve an array', async function() {
      const arr = [{ foo: 'bar' }, ['foo', 'bar'], 12345.6789, 'foo', true, false]
      assert.strictEqual(await assertCatch(() => RedisClient.cache('array', arr, 1)), false)
      assert.deepEqual(await RedisClient.cache('array'), arr)
    })

    it('SHOULD save and retrieve an string', async function() {
      assert.strictEqual(await assertCatch(() => RedisClient.cache('string', 'foo bar', 1)), false)
      assert.strictEqual(await RedisClient.cache('string'), 'foo bar')
    })

    it('SHOULD disappear after 1 second', async function() {
      assert.strictEqual(await assertCatch(() => RedisClient.cache('string', 'John Doe', 1)), false)
      await waitFor(1000)
      assert.strictEqual(await RedisClient.cache('string'), undefined)
    })

    it('SHOULD save and retrieve null', async function() {
      assert.strictEqual(await assertCatch(() => RedisClient.cache('null', null, 1)), false)
      assert.strictEqual(await RedisClient.cache('null'), null)
    })

    it('SHOULD save and retrieve undefined', async function() {
      assert.strictEqual(await assertCatch(() => RedisClient.cache('undefined', undefined, 1)), false)
      assert.strictEqual(await RedisClient.cache('undefined'), undefined)
    })

    it('SHOULD fail with a function', async function() {
      assert.strictEqual(await assertCatch(() => RedisClient.cache('function', waitFor, 1)), true)
    })
  })

  after(function() {
    RedisClient.client.quit()
  })
})
