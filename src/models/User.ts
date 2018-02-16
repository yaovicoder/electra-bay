import { model, PassportLocalDocument, PassportLocalModel, Schema } from 'mongoose'
import * as passportLocalMongoose from 'passport-local-mongoose'

export interface User extends PassportLocalDocument {
  username: string
  password: string
  email: string
  slug: string
  isActivated: boolean
  isAdmin: boolean
  isManager: boolean
  isVerified: boolean
  gravatar: string
  createdAd: Date
  updatedAt: Date
}

// tslint:disable-next-line:variable-name
const UserSchema: Schema = new Schema({
  // username: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  email: {
    type: String,
    // set: (email: string): string => email.toLowerCase(),
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isManager: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  gravatar: {
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
})

UserSchema.plugin(passportLocalMongoose)

export default model('User', UserSchema) as PassportLocalModel<User>
