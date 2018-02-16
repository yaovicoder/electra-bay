import { Document, model, Schema, Types } from 'mongoose'

export interface UserActivationKey extends Document {
  user: Types.ObjectId
  key: string
  createdAd: Date
  updatedAt: Date
}

const ONE_WEEK_IN_SECONDS: number = 604800

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
    expires: ONE_WEEK_IN_SECONDS,
  },
}))
