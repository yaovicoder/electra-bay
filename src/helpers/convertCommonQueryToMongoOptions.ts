/*import { Schema } from 'jsonschema'
import { FindOneOptions } from 'mongodb'

interface RequestCommonQuery {
  limit: string
  skip: string
  sortBy: string
  sortOrder: string
}

// tslint:disable:object-literal-sort-keys
export const requestCommonQuerySchema: Schema = {
  type: 'object',
  properties: {
    skip: {
      type: 'string',
      pattern: '^\\d+$',
      minimum: 0,
    },
    limit: {
      type: 'string',
      pattern: '^([123456789]\\d?|100)$',
    },
    sortBy: {
      type: 'string',
    },
    sortOrder: {
      type: 'string',
      pattern: '^-?1$',
    },
  },
}
// tslint:enable:object-literal-sort-keys

export default function({ limit, skip, sortBy, sortOrder }: RequestCommonQuery): FindOneOptions {
  const options: FindOneOptions = {}

  if (limit !== undefined) options.limit = Number(limit)
  if (skip !== undefined) options.skip = Number(skip)
  if (sortBy !== undefined) {
    const sort: any = {}
    sort[sortBy] = sortOrder !== undefined ? Number(sortOrder) : 1
    options.sort = { ...sort }
  }

  return options
}*/
