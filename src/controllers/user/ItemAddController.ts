import * as R from 'ramda'

import BaseController from '..'
import slugify from '../../helpers/slugify'

import { Category } from '../../models/Category'
import ItemSchema, { Item } from '../../models/Item'

type ItemAddFormFields = {
  name?: string,
  description?: string
  price?: string,
  photo?: string,
}

const HTTP_STATUS_CODE_NOT_FOUND: number = 404
const ITEM_DESCRIPTION_LENGTH_MIN: number = 50

export default class ItemAddController extends BaseController {
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

        this.render('user/item-add', {
          categoryCurrent,
          categoryCurrentChain,
        })
      })
      .catch(this.answerError)
  }

  public post(): void {
    this.getCategories()
      .then((categories: Category[]) => {
        const categoryCurrent: Category = R.find(R.propEq('slug', this.req.params.categorySlug))(categories)
        if (categoryCurrent === undefined) {
          this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND)

          return
        }

        const errors: ItemAddFormFields = {}
        const { name, description, price } = this.req.body as ItemAddFormFields

        if (typeof name !== 'string' || name.length === 0) {
          errors.name = 'You must enter a name.'
        }

        if (typeof description !== 'string' || description.length === 0) {
          errors.description = 'You must enter a description.'
        } else if (description.length < ITEM_DESCRIPTION_LENGTH_MIN) {
          errors.description = 'The decription must contain at least 50 characters.'
        }

        const priceNumber: number = Number(price)

        if (isNaN(priceNumber) || priceNumber === 0) {
          errors.price = 'You must set a price.'
        } else if (priceNumber < 0) {
          errors.price = 'The price must be positive.'
        }

        if (this.req.file === undefined) {
          errors.photo = 'You must add a photo.'
        }

        if (!R.equals(errors, {})) {
          this.req.flash('name', name)
          this.req.flash('description', description)
          this.req.flash('price', price)

          R.toPairs<ItemAddFormFields, string>(errors)
            .map(([error, message]: [ItemAddFormFields, string]) => this.req.flash(`${error}Error`, message))

          this.res.redirect(this.req.path)

          return
        }

        const item: Item = new ItemSchema({
          category: categoryCurrent._id,
          user: this.req.user._id,
          name: this.req.body.name,
          description: this.req.body.description,
          price: this.req.body.price,
          slug: slugify(this.req.body.name),
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        this.db.save('Item', item)
          .then((item: Item) => this.res.redirect(`/u/${this.req.user.slug}/listings`))
          .catch(this.answerError)
      })
      .catch(this.answerError)
  }
}
