import BaseController from '..'

import { Item } from '../../models/Item'

export default class ItemController extends BaseController {
  public get(): void {
    this.db.findOne<Item>('Item', {
      slug: this.req.params.itemSlug
    })
      .then((item: Item) => this.renderWithCache('web/item', { item }))
      .catch(this.answerError)
  }
}
