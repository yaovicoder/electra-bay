import BaseController from '..'

import { Category } from '../../models/Category'

export default class ItemAddController extends BaseController {
  public get(): void {
    this.db.findOne<Category>('Category', {
      slug: this.req.params.categorySlug
    })
      .then((category: Category) => this.render('user/item-add'))
      .catch(this.answerError)
  }
}
