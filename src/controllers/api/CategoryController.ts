import BaseController from '..'
import slugify from '../../helpers/slugify'

import CategorySchema, { Category, CategoryTreeBranch } from '../../models/Category'

const HTTP_STATUS_CODE_OK: number = 200
const HTTP_STATUS_CODE_CREATED: number = 201
const HTTP_STATUS_CODE_ACCEPTED: number = 202
const HTTP_STATUS_CODE_NOT_FOUND: number = 404

export default class CategoryController extends BaseController {
  protected isJson: boolean = true

  public post(): void {
    // tslint:disable:object-literal-sort-keys
    const schema: any = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 1,
        },
      },
      additionalProperties: false,
      required: ['name'],
    }
    // tslint:enable:object-literal-sort-keys

    this.validateJsonSchema(schema, (): void => {
      this.getCategoriesTree()
        .then((categoriesTree: CategoryTreeBranch[]) => {
          const category: Category = new CategorySchema({
            name: this.req.body.name,
            slug: slugify(this.req.body.name),
            position: categoriesTree.length,
            createdAt: new Date(),
            updatedAt: new Date(),
          })

          this.db.save('Category', category)
            .then((category: Category) => {
              this.cacheCategoriesTree()
                .then((categoriesTree: CategoryTreeBranch[]) =>
                  this.res.status(HTTP_STATUS_CODE_CREATED).json(categoriesTree)
                )
                .catch(this.answerError)
            })
            .catch(this.answerError)

        })
        .catch(this.answerError)
    })
  }

  public put(): void {
    // tslint:disable:object-literal-sort-keys
    const schema: any = {
      type: 'object',
      properties: {
        parent: {
          type: ['string', 'null'],
        },
        position: {
          type: 'number',
        },
      },
      additionalProperties: false,
      required: ['parent', 'position'],
    }
    // tslint:enable:object-literal-sort-keys

    this.validateJsonSchema(schema, (): void => {
      const query: any = this.req.body

      if (query.parent === null) {
        delete query.parent
        query.$unset = { parent: '' }
      }

      this.db.findByIdAndUpdate('Category', this.req.params.categoryId, query)
        .then((category: Category) => {
          if (category === null) {
            this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND)

            return
          }

          this.cacheCategoriesTree()
            .then((categoriesTree: CategoryTreeBranch[]) =>
              this.res.status(HTTP_STATUS_CODE_OK).json(categoriesTree)
            )
            .catch(this.answerError)
        })
        .catch(this.answerError)
    })
  }

  public delete(): void {
    this.db.findById('Category', this.req.params.categoryId)
      .then((category: Category) => {
        if (category === null) {
          this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND)

          return
        }

        category.remove()
          .then((category: Category) => {
            this.cacheCategoriesTree()
              .then((categoriesTree: CategoryTreeBranch[]) =>
                this.res.status(HTTP_STATUS_CODE_ACCEPTED).json(categoriesTree)
              )
              .catch(this.answerError)
          })
          .catch(this.answerError)

      })
      .catch(this.answerError)
  }
}
