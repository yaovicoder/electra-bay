import { Document, model, Schema, Types } from 'mongoose'

export interface Category extends Document {
  parent?: Types.ObjectId
  name: string
  slug: string
  position: number
  createdAt: Date
  updatedAt: Date
}

export interface CategoryTreeBranch {
  id: string
  parent: string | null
  name: string
  slug: string
  position: number
  depth: number | undefined
  children: CategoryTreeBranch[]
}

export default model<Category>('Category', new Schema({
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  position: {
    type: Number,
    min: 0,
    required: true,
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
