import BaseController from '..'

import { Category } from '../../models/Category'

export default class HomeController extends BaseController {
  public get(): void {
    this.db.find<Category>('Category', {
      parent: null
    })
      .then((categories: Category[]) => this.render('web/home'))
      .catch(this.answerError)
  }
}
