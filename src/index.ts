import * as dotenv from 'dotenv'
import * as fs from 'fs'
import { Lexpress, LexpressOptions } from 'lexpress'
import * as passport from 'passport'
import * as path from 'path'
// tslint:disable-next-line:no-require-imports no-var-requires typedef
const connectFlash = require('connect-flash')

import notFound from './middlewares/notFound'
import User from './models/User'
import routes from './routes'

dotenv.config()

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const commonConfig: LexpressOptions = {
  middlewares: [
    passport.initialize(),
    passport.session(),
    connectFlash(),
  ],
  notFoundmiddleware: notFound,
  routes,
  staticPath: 'public',
  viewsEngine: 'pug',
  viewsPath: 'src/views',
}

const lexpress: Lexpress = new Lexpress(process.env.NODE_ENV === 'development'
  ? {
    ...commonConfig,
    ...{
      https: {
        cert: fs.readFileSync(path.resolve('./server.crt')),
        key: fs.readFileSync(path.resolve('./server.key')),
        requestCert: false,
        rejectUnauthorized: false
      },
    }
  }
  : commonConfig
)

lexpress.start()
