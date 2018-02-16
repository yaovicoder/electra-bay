import BaseController from '..'

import { Category } from '../../models/Category'

export default class HomeController extends BaseController {
  public get(): void {
    // this.db.save<Category>('Category', {
    //   parent: '5a84e7af044de50c400997c9',
    //   name: 'Writing',
    //   slug: 'writing',
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // })

    this.db.find<Category>('Category', {
      parent: null
    })
      .then((categories: Category[]) => this.renderWithCache('web/home'))
      .catch(this.answerError)
  }
}
