import to from 'await-to-js'
import * as dotenv from 'dotenv'
import * as redis from 'redis'
import { promisify } from 'util'

import tryCatch from '../../helpers/tryCatch'

import { CacheValue } from './types'

dotenv.config()

const client: redis.RedisClient = redis.createClient({ url: process.env.REDIS_URL })

export default interface RedisClient {
  cache<T extends CacheValue>(key: string): Promise<T | undefined>
  cache<T extends CacheValue>(key: string, value: T, forInSeconds: number): Promise<void>
}

export default class RedisClient {
  public get client(): redis.RedisClient {
    return client
  }

  public get: (key: string) => Promise<string> = promisify(client.get).bind(client)
  public set: (key: string, value: string) => Promise<string> = promisify(client.set).bind(client)
  public expire: (key: string, seconds: number) => Promise<string> = promisify(client.expire).bind(client)

  // tslint:disable-next-line:typedef
  public async cache<T extends CacheValue>(key: string, value?: T, forInSeconds?: number) {
    if (value !== undefined) {
      if (forInSeconds === undefined) throw new Error(`RedisClient#cache(): The forInSeconds param must be set.`)
      if (forInSeconds <= 0) throw new Error(`RedisClient#cache(): The forInSeconds param must be greater than 0.`)

      let valueString: string

      switch (true) {
        case typeof value === 'boolean':
          valueString = `b${Number(value).toString()}`
          break

        case typeof value === 'number':
          valueString = `n${value.toString()}`
          break

        case typeof value === 'object':
          const [err] = tryCatch(() => valueString = `o${JSON.stringify(value)}`)
          if (err !== undefined) throw err
          break

        case typeof value === 'string':
          valueString = `s${value}`
          break

        default:
          throw new Error(`RedisClient#cache(): We can't handle this value type.`)
      }

      try {
        await to(this.set(key, valueString))
        await to(this.expire(key, forInSeconds))
      }
      catch (err) { throw err }

      return void 0
    }

    const [err, valueString] = await to(this.get(key))
    if (err !== null) throw err

    if (valueString === null) return undefined

    switch (valueString[0]) {
      case 'b':
        return Boolean(Number(valueString.substr(1))) as T

      case 'n':
        return Number(valueString.substr(1)) as T

      case 'o':
        return JSON.parse(valueString.substr(1)) as T

      case 's':
        return valueString.substr(1) as T

      default:
        throw new Error(`RedisClient#cache(): We couldn't guess the value type.`)
    }
  }
}
