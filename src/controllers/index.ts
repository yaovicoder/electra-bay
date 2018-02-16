import * as lexpress from 'lexpress'
import * as R from 'ramda'

import MongoDbClient from '../libs/MongoDbClient'
import { Category } from '../models/Category'

const DEFAULT_CACHE_EXPIRATION_IN_SECONDS: number = 1

export default class BaseController extends lexpress.BaseController {
  protected db: MongoDbClient = new MongoDbClient()
  protected isJson: boolean = false

  protected render(view: string, options: any = {}): void {
    const flash: {} = this.req.flash()

    this.db.find<Category>('Category', {
      parent: null
    })
      .then((categories: Category[]) => this.res.render(view, {
        ...options,
        categories,
        flash: R.equals(flash, {}) ? undefined : flash,
        me: this.req.user
      }))
      // .catch(this.answerError)
  }

  protected renderWithCache(
    view: string,
    // tslint:disable-next-line:ban-types
    options: any = {},
    cacheForInSeconds: number = DEFAULT_CACHE_EXPIRATION_IN_SECONDS
  ): void {
    const flash: {} = this.req.flash()

    this.db.find<Category>('Category', {
      parent: null
    })
      .then((categories: Category[]) => this.res.cache(cacheForInSeconds).render(view, {
        ...options,
        categories,
        flash: R.equals(flash, {}) ? undefined : flash,
        me: this.req.user
      }))
      // .catch(this.answerError)
  }
}
