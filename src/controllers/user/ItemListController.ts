// import * as R from 'ramda'
import * as moment from 'moment'

import BaseController from '..'
// import slugify from '../../helpers/slugify'
// import AwsClient from '../../libs/AwsClient'

// import { Category } from '../../models/Category'
// import ItemSchema, { Item } from '../../models/Item'
import { Item } from '../../models/Item'

interface ItemWithDate extends Item {
  since: string
}

export default class ItemListController extends BaseController {
  public get(): void {
    this.db.find<Item>('Item', {
      user: this.req.user.id
    })
      .then((items: Item[]) => {
        const itemsWithDate: ItemWithDate[] = items.map((item: Item) => {
          (item as ItemWithDate).since = moment(item.createdAt).fromNow()

          return item as ItemWithDate
        })

        this.render('user/item-list', { items: itemsWithDate })
      })
      .catch(this.answerError)
  }
}
