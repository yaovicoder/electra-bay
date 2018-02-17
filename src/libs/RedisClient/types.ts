interface CacheValueObject {
  [key: string]: CacheValue
}

export type CacheValue = any[] | boolean | number | CacheValueObject | string
