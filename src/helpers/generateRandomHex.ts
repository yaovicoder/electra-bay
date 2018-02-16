import * as crypto from 'crypto'

const BUFFER_SIZE_DIVIDER: number = 2

export default function(length: number = 64): string {
  return crypto.randomFillSync(Buffer.alloc(length / BUFFER_SIZE_DIVIDER)).toString('hex')
}
