import { SchemaDefinition } from 'mongoose'

export const slug: SchemaDefinition[0] = {
  type: String,
  match: /^([a-z]{1,2}|[a-z][a-z\-]+[a-z])$/,
  required: true,
  unique: true,
}
