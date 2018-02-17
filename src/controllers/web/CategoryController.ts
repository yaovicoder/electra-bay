import * as R from 'ramda'

import BaseController from '..'

import { Category } from '../../models/Category'
import { Item } from '../../models/Item'

const HTTP_STATUS_CODE_NOT_FOUND: number = 404

export default class CategoryController extends BaseController {
  public get(): void {
    this.getCategories()
      .then((categories: Category[]) => {
        const categoryCurrent: Category = R.find(R.propEq('slug', this.req.params.categorySlug))(categories)
        if (categoryCurrent === undefined) {
          this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND)

          return
        }

        const categoryCurrentChain: string[] = [categoryCurrent._id]
        let categoryCurrentChainLink: Category = categoryCurrent
        while (categoryCurrentChainLink.parent !== undefined) {
          categoryCurrentChain.push(String(categoryCurrentChainLink.parent))
          categoryCurrentChainLink = R.find(R.propEq('_id', categoryCurrentChainLink.parent))(categories)
        }

        this.db.find<Item>('Item', { category: categoryCurrent._id })
          .then((items: Item[]) => this.render('web/category', {
            categoryCurrent,
            categoryCurrentChain,
            items,
          }))
          .catch(this.answerError)
      })
      .catch(this.answerError)
  }
}
