import BaseController from '..'

import { CategoryTreeBranch } from '../../models/Category'

export default class CategoryController extends BaseController {
  public get(): void {
    this.cacheCategoriesTree()
      .then((categoriesLast: CategoryTreeBranch[]) => this.render('admin/categories', { categoriesLast }))
      .catch(this.answerError)
  }
}
