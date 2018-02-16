// tslint:disable:max-classes-per-file

// import * as passport from 'passport'
// import * as passportLocal from 'passport-local'

import BaseController from '..'

// import { User } from '../../models/User'

// class LocalStrategy extends passportLocal.Strategy {}

export default class LogInController extends BaseController {
  public get(): void {
    this.render('login')
  }

  /*public post(): void {
    passport.use(new LocalStrategy(
      (email: string, password: string): void => {
        this.db.findOne<User>('User', { email })
          .then((user: User): void => {
            if (!user) {
              this.log('Incorrect username.')

              return this.render('login', {})
            }

            if (!(user as any).validPassword(password)) this.log('Incorrect password.')

            this.res.redirect('/')
          })
          .catch(this.answerError)
      }
  }*/
}
