import BaseController from '..'

import { User } from '../../models/User'
import { UserActivationKey } from '../../models/UserActivationKey'

export default class ActivateController extends BaseController {
  public get(): void {
    this.db.findOne<UserActivationKey>('UserActivationKey', { key: this.req.query.key })
      .then((userActivationKey: UserActivationKey) => {
        if (userActivationKey === null) {
          this.render('auth/activate', { error: `Sorry but this key does not exists in our books.` })

          return
        }

        const userChanges: Partial<User> = {
          isActivated: true,
          updatedAt: new Date(),
        }

        userActivationKey.remove()
          .then((userActivationKey: UserActivationKey) => {
            this.db.findByIdAndUpdate<User>('User', userActivationKey.user, userChanges)
              .then((user: User) => {
                if (user === null) {
                  this.render('auth/activate', {
                    error: `Something went wrong: we could't find the related user.`
                  })

                  return
                }

                user.set(userChanges)

                this.req.login(user, (err: Error) => {
                  if (err !== undefined) {
                    this.logError(err.message)
                    this.render('auth/activate', {
                      error: `Something went wrong: we weren't able to re-authenticate the related user.`
                    })

                    return
                  }

                  this.render('auth/activate')
                })
              })
              .catch(this.answerError)
          })
          .catch(this.answerError)
      })
      .catch(this.answerError)
  }
}
