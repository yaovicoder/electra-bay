import * as dotenv from 'dotenv'
import * as EmailValidator from 'email-validator'
// import * as mongoose from 'mongoose'
import * as passport from 'passport'
import * as R from 'ramda'

// tslint:disable-next-line:no-require-imports no-var-requires typedef
const sendgridMail = require('@sendgrid/mail')

import BaseController from '..'
import generateRandomHex from '../../helpers/generateRandomHex'
import md5 from '../../helpers/md5'
import normalizeUsername from '../../helpers/normalizeUsername'

import UserModel, { User } from '../../models/User'
import UserActivationKeyModel, { UserActivationKey } from '../../models/UserActivationKey'

interface SignUpFormFields {
  username?: string,
  email?: string
  password?: string,
  passwordBis?: string,
}

dotenv.config()

const PASSWORD_LENGTH_MIN: number = 12

export default class SignUpController extends BaseController {
  public get(): void {
    this.render('auth/signup')
  }

  public post(): void {
    const errors: SignUpFormFields = {}
    const { email, password, passwordBis, username } = this.req.body as SignUpFormFields

    if (typeof username !== 'string' || username.length === 0) {
      errors.username = 'You must enter a username.'
    } else if (normalizeUsername(username) !== username) {
      errors.username = `Your username can only contain unaccented lowercase letters, numbers and dashes.
                        It cannot start or finish with a dash.`
    }

    if (typeof email !== 'string' || email.length === 0) {
      errors.email = 'You must enter an email.'
    } else if (!EmailValidator.validate(email)) {
      errors.email = 'You must enter a valid email.'
    } else if (email.toLowerCase() !== email) {
      errors.email = 'Your email must be in lowercase.'
    }

    if (typeof password !== 'string' || password.length < PASSWORD_LENGTH_MIN) {
      errors.password = 'Your password must contain at least 12 characters.'
    } else if (passwordBis !== password) {
      errors.passwordBis = 'Your repeated password is different from the first one.'
    }

    if (!R.equals(errors, {})) return this.render('auth/signup', { errors, values: this.req.body })

    this.db.find<User>('User', {
      $or: [
        { email },
        { username },
      ]
    })
      .then((users: User[]) => {
        if (users.length !== 0) {
          if (users.filter((user: User) => user.username === username).length !== 0) {
            errors.username = `Sorry but this username is already taken.
                              <a href="/reset">Did you forget your password ?</a>`
          }

          if (users.filter((user: User) => user.email === email).length !== 0) {
            errors.email = `This email is already attached to an account.
                            <a href="/reset">Did you forget your password ?</a>`
          }
        }

        if (!R.equals(errors, {})) return this.render('auth/signup', { errors, values: this.req.body })

        const userModel: User = new UserModel({
          username,
          email,
          slug: username,
          gravatar: md5(email),
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        UserModel.register(userModel, password, ((err: Error, user: User): void => {
          if (err !== null) {
            this.answerError(err.message)

            return
          }

          const userActivationKeyModel: UserActivationKey = new UserActivationKeyModel({
            user,
            key: generateRandomHex(),
            createdAt: new Date(),
            updatedAt: new Date(),
          })

          userActivationKeyModel.save((err: Error, userActivationKey: UserActivationKey) => {
            if (err !== null) {
              this.answerError(err.message)

              return
            }

            const uri: string = `${process.env.BASE_URL}/activate?key=${userActivationKey.key}`

            sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)
            sendgridMail.send({
              to: email,
              from: 'Electra Bay <help@electra-bay.com>',
              subject: 'Please confirm your email address to activate your account',
              text: `You will confirm your email address and activate your account
                    by clicking on the following link: ${uri}`,
              html: `<p>You will confirm your email address and activate your account
                    by clicking on the following link:<p>
                    <p><a href="${uri}">${uri}</a></p>`,
            })

            passport.authenticate('local')(this.req, this.res, () => this.res.redirect('/'))
          })
        }))
      })
      .catch(this.answerError)
  }
}
