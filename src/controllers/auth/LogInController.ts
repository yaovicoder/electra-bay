import * as passport from 'passport'

import BaseController from '..'
import { User } from '../../models/User'

const ONE_MONTH_IN_MILISECONDS: number = 2592000000

export default class LogInController extends BaseController {
  public get(): void {
    this.render('auth/login')
  }

  public post(): void {
    passport.authenticate('local', (err: Error, user: User | false) => {
      if (err !== null) {
        this.answerError(err)

        return
      }

      if (!user) {
        this.render('auth/login', {
          errors: {
            username: 'Wrong username and/or password.'
          },
          values: this.req.body
        })

        return
      }

      this.req.logIn(user, (err: Error) => {
        if (err !== null) {
          this.answerError(err)

          return
        }
      })

      if (this.req.body.rememberMe === 'on') {
        this.req.session.cookie.maxAge = ONE_MONTH_IN_MILISECONDS
      } else {
        this.req.session.cookie.expires = false
      }

      this.res.redirect('/')
    })(this.req, this.res, this.next)
  }
}
