import { NextFunction, Request, Response, Route } from 'lexpress'
import * as multer from 'multer'

import AdminCategoryController from './controllers/admin/CategoryController'

import ApiCategoryController from './controllers/api/CategoryController'

import AuthActivateController from './controllers/auth/ActivateController'
import AuthLogInController from './controllers/auth/LogInController'
import AuthLogOutController from './controllers/auth/LogOutController'
import AuthSignUpController from './controllers/auth/SignUpController'

import UserItemAddController from './controllers/user/ItemAddController'

import WebCategoryController from './controllers/web/CategoryController'
import WebHomeController from './controllers/web/HomeController'
import WebItemController from './controllers/web/ItemController'
import WebUserController from './controllers/web/UserController'

import isAdmin from './middlewares/isAdmin'
import isAuthenticated from './middlewares/isAuthenticated'

const UPLOAD_FILE_SIZE_MAX: number = 8388608

const upload: Route['middleware'] = multer({
  limits: {
    fileSize: UPLOAD_FILE_SIZE_MAX,
  },
  storage: multer.memoryStorage(),
})
  .single('photo')

// tslint:disable:object-literal-sort-keys
const routes: Route[] = [
  /*
    Website Routes
  */

  {
    path: '/',
    method: 'get',
    controller: WebHomeController,
  },
  {
    path: '/c/:categorySlug',
    method: 'get',
    controller: WebCategoryController,
  },
  {
    path: '/i/:itemSlug',
    method: 'get',
    controller: WebItemController,
  },
  {
    path: '/u/:userSlug',
    method: 'get',
    controller: WebUserController,
  },

  /*
    Authentication Routes
  */

  {
    path: '/signup',
    method: 'get',
    controller: AuthSignUpController,
    settings: { isCached: false },
  },
  {
    path: '/signup',
    method: 'post',
    controller: AuthSignUpController,
    settings: { isCached: false },
  },
  {
    path: '/activate',
    method: 'get',
    controller: AuthActivateController,
    settings: { isCached: false },
  },
  {
    path: '/login',
    method: 'get',
    controller: AuthLogInController,
    settings: { isCached: false },
  },
  {
    path: '/login',
    method: 'post',
    controller: AuthLogInController,
    settings: { isCached: false },
  },
  {
    path: '/logout',
    method: 'get',
    controller: AuthLogOutController,
    settings: { isCached: false },
  },

  /*
    User Routes
  */

  {
    path: '/c/:categorySlug/insert',
    method: 'get',
    controller: UserItemAddController,
    middleware: isAuthenticated,
    settings: { isCached: false },
  },
  {
    path: '/c/:categorySlug/insert',
    method: 'post',
    controller: UserItemAddController,
    middleware: [
      isAuthenticated,
      (req: Request, res: Response, next: NextFunction): void => {
        upload(req, res, (err: Error) => {
          if (err) req.flash('photoError', err.message)
          next()
        })
      },
    ],
    settings: { isCached: false },
  },

  /*
    Admin Routes
  */

  {
    path: '/a/category',
    method: 'get',
    controller: AdminCategoryController,
    middleware: isAdmin,
    settings: { isCached: false }
  },
  {
    path: '/a/category',
    method: 'post',
    controller: AdminCategoryController,
    middleware: isAdmin,
    settings: { isCached: false }
  },

  /*
    Api Routes
  */

  {
    path: '/api/category',
    method: 'post',
    controller: ApiCategoryController,
    middleware: isAdmin,
    settings: { isCached: false }
  },
  {
    path: '/api/category/:categoryId',
    method: 'put',
    controller: ApiCategoryController,
    middleware: isAdmin,
    settings: { isCached: false }
  },
  {
    path: '/api/category/:categoryId',
    method: 'delete',
    controller: ApiCategoryController,
    middleware: isAdmin,
    settings: { isCached: false }
  },
]

export default routes
