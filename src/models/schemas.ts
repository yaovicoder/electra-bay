import { SchemaDefinition } from 'mongoose'

export const slug: SchemaDefinition[0] = {
  type: String,
  match: /^([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])$/,
  required: true,
  unique: true,
}
