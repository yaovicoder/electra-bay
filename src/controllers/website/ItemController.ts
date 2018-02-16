import BaseController from '..'

import { Item } from '../../models/Item'

export default class ItemController extends BaseController {
  public get(): void {
    this.db.findOne<Item>('Item', {
      slug: this.req.params.ItemSlug
    })
      .then((item: Item) => this.renderWithCache('item', { item }))
      .catch(this.answerError)
  }
}
