import BaseController from '..'

import { Category } from '../../models/Category'
import { Item } from '../../models/Item'

const HTTP_STATUS_CODE_NOT_FOUND: number = 404

export default class CategoryController extends BaseController {
  public get(): void {
    this.db.findOne<Category>('Category', {
      slug: this.req.params.categorySlug
    })
      .then((category: Category) => {
        if (category === null) {
          this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND)

          return
        }

        Promise.all<Category[], Item[]>([
          this.db.find<Category>('Category', { parent: category._id }),
          this.db.find<Item>('Item', { category: category._id }),
        ])
          .then((res: [Category[], Item[]]) => this.renderWithCache('web/category', {
            category,
            items: res[1],
            // tslint:disable-next-line:no-magic-numbers
            subCategory: res[2]
          }))
          .catch(this.answerError)
      })
      .catch(this.answerError)
  }
}
