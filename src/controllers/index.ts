import * as lexpress from 'lexpress'
import * as R from 'ramda'

import MongoDbClient from '../libs/MongoDbClient'
import RedisClient from '../libs/RedisClient'
import { Category, CategoryTreeBranch } from '../models/Category'

const ONE_DAY_IN_SECONDS: number = 86400

export default class BaseController extends lexpress.BaseController {
  protected db: MongoDbClient = new MongoDbClient()
  protected isJson: boolean = false
  protected redis: RedisClient = new RedisClient()

  protected render(view: string, options: any = {}): void {
    const flash: {} = this.req.flash()

    this.getCategories()
      .then((categories: CategoryTreeBranch[]) => this.res.render(view, {
        ...options,
        categories,
        flash: R.equals(flash, {}) ? undefined : flash,
        me: this.req.user
      }))
      .catch(this.answerError)
  }

  protected async getCategories(): Promise<CategoryTreeBranch[]> {
    const categories: CategoryTreeBranch[] | undefined = await this.redis.cache<CategoryTreeBranch[]>('categories')

    if (categories !== undefined) return categories

    return this.cacheCategoriesTree()
  }

  protected async cacheCategoriesTree(): Promise<CategoryTreeBranch[]> {
    const categories: CategoryTreeBranch[] = await this.getCategoriesTree()
    await this.redis.cache('categories', categories, ONE_DAY_IN_SECONDS)

    return categories
  }

  /**
   * Transform the MongoDB Category collection into an ordered tree.
   */
  protected async getCategoriesTree(
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

      return this.getCategoriesTree(categories)
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

    return this.getCategoriesTree(
      categoriesWithNewChildren.filter(({ id }: CategoryTreeBranch) => !newChildrenIds.includes(id)),
      nextDepth
    )
  }

  private sortByPosition: <T>(list: ReadonlyArray<T>) => T[] = R.sortBy(R.prop('position'))
}
