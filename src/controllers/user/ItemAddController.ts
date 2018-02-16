import BaseController from '..'

import { Category } from '../../models/Category'

export default class ItemAddController extends BaseController {
  public get(): void {
    this.db.find<Category>('Category', {})
      .then((categories: Category[]) => this.res.render('user/item-add', { form: { categories } }))
      .catch(this.answerError)
  }
}
