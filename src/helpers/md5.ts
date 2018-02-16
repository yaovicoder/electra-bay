import * as crypto from 'crypto'

export default function(value: string): string {
  return crypto.createHash('md5').update(value).digest('hex')
}
