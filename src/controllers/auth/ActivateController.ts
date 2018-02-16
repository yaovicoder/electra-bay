import BaseController from '..'

// import { User } from '../../models/User'
import { UserActivationKey } from '../../models/UserActivationKey'

export default class ActivateController extends BaseController {
  public get(): void {
    this.db.findOne<UserActivationKey>('UserActivationKey', { key: this.req.query.key })
      .then((userActivationKey: UserActivationKey) => {
        if (userActivationKey === null) {
          this.render('activate', { error: 'Sorry but this key does not exists in our books.' })

          return
        }

        this.render('activate')
      })
      .catch(this.answerError)
  }
}
