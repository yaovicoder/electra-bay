const dotenv = require('dotenv')
const log = require('@inspired-beings/log')
const redis = require('redis')

dotenv.config()

log.info('Flushing everything stored in Redis...')

redis
  .createClient({ url: process.env.REDIS_URL })
  .flushall((err, reply) => {
    if (err) {
      console.err(err.message)

      return
    }

    log.info(`Redis replied with: %s`, reply)
    process.exit()
  })
