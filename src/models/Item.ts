import { Document, model, Schema, Types } from 'mongoose'

import { slug } from './schemas'

export interface Item extends Document {
  category: Types.ObjectId
  user: Types.ObjectId
  name: string
  description: string
  price: number
  slug: string
  createdAt: Date
  updatedAt: Date
}

export default model<Item>('Item', new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    match: /^.{50}/,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  slug,
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
}))
