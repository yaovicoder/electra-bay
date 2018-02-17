import * as lexpress from 'lexpress'
import * as R from 'ramda'

import MongoDbClient from '../libs/MongoDbClient'
import RedisClient from '../libs/RedisClient'
import { Category, CategoryTreeBranch } from '../models/Category'

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
    const categoriesTree: CategoryTreeBranch[] = await this.generateCategoriesTree()
    await this.redis.cache('categoriesTree', categoriesTree, ONE_DAY_IN_SECONDS)

    return categoriesTree
  }

  /**
   * Transform the MongoDB Category collection into an ordered tree.
   */
  protected async generateCategoriesTree(
    categories?: CategoryTreeBranch[],
    depth: number = 0
  ): Promise<CategoryTreeBranch[]> {
    if (categories === undefined) {
      const categoryDocuments: Category[] = await this.db.find<Category>('Category')

      const categories: CategoryTreeBranch[] = categoryDocuments.map((category: Category) => ({
        id: category._id.toString(),
        parent: category.parent === undefined ? undefined : category.parent.toString(),
        name: category.name,
        slug: category.slug,
        position: category.position,
        depth: category.parent === undefined ? 0 : undefined,
        children: [],
      }))

      return this.generateCategoriesTree(categories)
    }

    if (categories.filter((category: CategoryTreeBranch) => category.depth === undefined).length === 0) {
      return this.sortByPosition(categories.filter((category: CategoryTreeBranch) => category.depth === 0))
    }

    const newChildrenIds: string[] = []
    const nextDepth: number = depth + 1

    const categoriesWithNewChildren: CategoryTreeBranch[] = categories.map((category: CategoryTreeBranch) => {
      if (category.depth !== depth) return category

      category.children = this.sortByPosition(
        categories
          .filter((childCategory: CategoryTreeBranch) => childCategory.parent === category.id)
          .map((childCategory: CategoryTreeBranch) => {
            newChildrenIds.push(childCategory.id)

            return { ...childCategory, ...{ depth: nextDepth } }
          })
      )

      return category
    })

    return this.generateCategoriesTree(
      categoriesWithNewChildren.filter(({ id }: CategoryTreeBranch) => !newChildrenIds.includes(id)),
      nextDepth
    )
  }

  private sortByPosition: <T>(list: ReadonlyArray<T>) => T[] = R.sortBy(R.prop('position'))
}
