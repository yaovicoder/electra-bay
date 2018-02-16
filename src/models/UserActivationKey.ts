import { Document, model, Schema, Types } from 'mongoose'

export interface UserActivationKey extends Document {
  user: Types.ObjectId
  key: string
  createdAd: Date
  updatedAt: Date
}

export default model<UserActivationKey>('UserActivationKey', new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  key: {
    type: String,
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
