import { Document, model, Schema, Types } from 'mongoose'

export interface Item extends Document {
  category: Types.ObjectId
  user: Types.ObjectId
  name: string
  description: string
  price: number
  slug: string
  createdAd: Date
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
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
}))
