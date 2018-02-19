import * as dotenv from 'dotenv'
import * as lexpress from 'lexpress'
import * as R from 'ramda'

import generateCategoriesTree from '../helpers/generateCategoriesTree'
import MongoDbClient from '../libs/MongoDbClient'
import RedisClient from '../libs/RedisClient'

import { Category, CategoryTreeBranch } from '../models/Category'

dotenv.config()

const ONE_DAY_IN_SECONDS: number = 86400
// tslint:disable-next-line:no-require-imports no-var-requires
const VERSION: string = require('../../package.json').version

export default class BaseController extends lexpress.BaseController {
  protected db: MongoDbClient = new MongoDbClient()
  protected isJson: boolean = false
  protected redis: RedisClient = new RedisClient()

  protected render(view: string, options: any = {}): void {
    const flash: {} = this.req.flash()

    this.getCategoriesTree()
      .then((categories: CategoryTreeBranch[]) => this.res.render(view, {
        ...options,
        baseUrl: process.env.BASE_URL,
        categories,
        flash: R.equals(flash, {}) ? undefined : flash,
        me: this.req.user,
        version: VERSION
      }))
      .catch(this.answerError)
  }

  protected async getCategories(): Promise<Category[]> {
    const categories: Category[] = await this.redis.cache<Category[]>('categories')

    if (categories !== undefined) return categories

    return this.cacheCategories()
  }

  protected async cacheCategories(): Promise<Category[]> {
    const categories: Category[] = await this.db.find<Category>('Category')
    await this.redis.cache('categories', categories, ONE_DAY_IN_SECONDS)

    return categories
  }

  protected async getCategoriesTree(): Promise<CategoryTreeBranch[]> {
    const categoriesTree: CategoryTreeBranch[] = await this.redis.cache<CategoryTreeBranch[]>('categoriesTree')

    if (categoriesTree !== undefined) return categoriesTree

    return this.cacheCategoriesTree()
  }

  protected async cacheCategoriesTree(): Promise<CategoryTreeBranch[]> {
    const categories: Category[] = await this.cacheCategories()
    const categoriesTree: CategoryTreeBranch[] = generateCategoriesTree(categories)
    await this.redis.cache('categoriesTree', categoriesTree, ONE_DAY_IN_SECONDS)

    return categoriesTree
  }
}
