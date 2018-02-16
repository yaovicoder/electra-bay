import BaseController from '..'

import { User } from '../../models/User'

export default class UserController extends BaseController {
  public get(): void {
    this.db.findOne<User>('User', {
      slug: this.req.params.userSlug
    })
      .then((user: User) => this.renderWithCache('user', { user }))
      .catch(this.answerError)
  }
}
