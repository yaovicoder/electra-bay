import log from '@inspired-beings/log'
import to from 'await-to-js'
import * as dotenv from 'dotenv'
import * as mongoose from 'mongoose'

import tryCatch from '../../helpers/tryCatch'
import CategoryModel from '../../models/Category'
import ItemModel from '../../models/Item'
import UserModel from '../../models/User'
import UserActivationKeyModel from '../../models/UserActivationKey'

import { Models } from './types'

dotenv.config()

const {
  MONGODB_URI
}: {
  MONGODB_URI: string
} = process.env as any

const MODELS: Models = {
  Category: CategoryModel,
  Item: ItemModel,
  User: UserModel,
  UserActivationKey: UserActivationKeyModel,
}

let clientIsConnected: boolean = false

export default class MongoDbClient {
  private async connect(): Promise<void> {
    const [err] = await to(mongoose.connect(MONGODB_URI))
    if (err !== null) {
      log.err(err.message)
      throw new Error(`libs/MongoDbClient: mongoose.connect() failed.`)
    }

    clientIsConnected = true
  }

  public async find<T extends mongoose.Document>(modelName: keyof Models, conditions: any = {}): Promise<T[]> {
    if (!clientIsConnected) {
      const [err] = await to(this.connect())
      if (err !== null) return Promise.reject(err)
    }

    // tslint:disable-next-line:variable-name
    const Model: mongoose.Model<mongoose.Document> = MODELS[modelName]

    return new Promise<T[]>((resolve: (result: T[]) => void, reject: (err: Error) => void): void => {
      Model.find(conditions, (err: Error, res: T[]) => {
        if (err !== null) {
          log.err(err.message)
          reject(new Error(`libs/MongoDbClient: Model.find() failed.`))

          return
        }

        resolve(res)
      })
    })
  }

  public async findOne<T extends mongoose.Document>(modelName: keyof Models, conditions: any = {}): Promise<T> {
    if (!clientIsConnected) {
      const [err] = await to(this.connect())
      if (err !== null) return Promise.reject(err)
    }

    // tslint:disable-next-line:variable-name
    const Model: mongoose.Model<mongoose.Document> = MODELS[modelName]

    return new Promise<T>((resolve: (result: T) => void, reject: (err: Error) => void): void => {
      Model.findOne(conditions, (err: Error, res: T) => {
        if (err !== null) {
          log.err(err.message)
          reject(new Error(`libs/MongoDbClient: Model.findOne() failed.`))

          return
        }

        resolve(res)
      })
    })
  }

  public async save<T extends mongoose.Document>(
    modelName: keyof Models,
    data: T,
    options: mongoose.SaveOptions = {}
  ): Promise<mongoose.Document> {
    if (!clientIsConnected) {
      const [err] = await to(this.connect())
      if (err !== null) return Promise.reject(err)
    }

    // tslint:disable-next-line:variable-name
    const Model: mongoose.Model<mongoose.Document> = MODELS[modelName]

    const [err, model] = tryCatch<mongoose.Document>(() => new Model(data))
    if (err !== undefined) return Promise.reject(err)

    return new Promise<mongoose.Document>((
      resolve: (result: mongoose.Document) => void,
      reject: (err: Error) => void
    ): void => {
      model.save(options, (err: Error, res: T) => {
        if (err !== null) {
          log.err(err.message)
          reject(new Error(`libs/MongoDbClient: Model.save() failed.`))

          return
        }

        resolve(res)
      })
    })
  }
}
