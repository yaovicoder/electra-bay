import { Model, PassportLocalModel } from 'mongoose'

import { Category } from '../../models/Category'
import { Item } from '../../models/Item'
import { User } from '../../models/User'
import { UserActivationKey } from '../../models/UserActivationKey'

export interface Models {
  Category: Model<Category>
  Item: Model<Item>
  User: PassportLocalModel<User>
  UserActivationKey: Model<UserActivationKey>
}
