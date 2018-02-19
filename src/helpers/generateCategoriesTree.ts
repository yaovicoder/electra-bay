import * as R from 'ramda'

import { Category, CategoryTreeBranch } from '../models/Category'

const sortByPosition: <T>(list: ReadonlyArray<T>) => T[] = R.sortBy(R.prop('position'))

/**
 * Transform a MongoDB Category collection into an ordered tree.
 */
export default function(categories: Category[]): CategoryTreeBranch[] {
  const categoriesTree: Array<Partial<CategoryTreeBranch>> = categories.map((category: Category) => ({
    id: category._id.toString(),
    parent: category.parent === undefined ? undefined : category.parent.toString(),
    name: category.name,
    slug: category.slug,
    position: category.position,
  }))

  return getBranchesFor(undefined, categoriesTree, 0)
}

function getBranchesFor(
  categoryId: string | undefined,
  categories: Array<Partial<CategoryTreeBranch>>,
  depth: number
): CategoryTreeBranch[] {
  return sortByPosition(
    categories
      .filter((category: CategoryTreeBranch) => category.parent === categoryId)
        .map((category: CategoryTreeBranch) => ({
            ...category,
            ...{
              depth,
              children: getBranchesFor(category.id, categories, depth + 1)
            }
        }))
  )
}
