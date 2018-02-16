import { Route } from 'lexpress'
import * as passport from 'passport'

import CategoryController from './controllers/website/CategoryController'
import HomeController from './controllers/website/HomeController'
import ItemController from './controllers/website/ItemController'
import UserController from './controllers/website/UserController'

import ActivateController from './controllers/auth/ActivateController'
import LogInController from './controllers/auth/LogInController'
import LogOutController from './controllers/auth/LogOutController'
import SignUpController from './controllers/auth/SignUpController'

import ItemAddController from './controllers/user/ItemAddController'

import isAuthenticated from './middlewares/isAuthenticated'

// tslint:disable:object-literal-sort-keys
const routes: Route[] = [
  /*
    Website Routes
  */

  {
    path: '/',
    method: 'get',
    controller: HomeController,
  },
  {
    path: '/c/:categorySlug',
    method: 'get',
    controller: CategoryController,
  },
  {
    path: '/p/:itemSlug',
    method: 'get',
    controller: ItemController,
  },
  {
    path: '/u/:userSlug',
    method: 'get',
    controller: UserController,
  },

  /*
    Authentication Routes
  */

  {
    path: '/signup',
    method: 'get',
    controller: SignUpController,
    settings: { isCached: false },
  },
  {
    path: '/signup',
    method: 'post',
    controller: SignUpController,
    settings: { isCached: false },
  },
  {
    path: '/activate',
    method: 'get',
    controller: ActivateController,
    settings: { isCached: false },
  },
  {
    path: '/login',
    method: 'get',
    controller: LogInController,
    settings: { isCached: false },
  },
  {
    path: '/login',
    method: 'post',
    call: passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
    }),
    settings: { isCached: false },
  },
  {
    path: '/logout',
    method: 'get',
    controller: LogOutController,
    settings: { isCached: false },
  },

  /*
    User Routes
  */

  {
    path: '/c/:categorySlug/insert',
    method: 'get',
    controller: ItemAddController,
    middleware: isAuthenticated,
    settings: { isCached: false },
  },

  /*
    Manager Routes
  */

  // {
  //   path: '/c/:categorySlug/create',
  //   method: 'get',
  //   middleware: isAuthenticated,
  //   settings: { isCached: false }
  // },

  /*
    Admin Routes
  */

  // {
  //   path: '/c/:categorySlug/create',
  //   method: 'get',
  //   middleware: isAuthenticated,
  //   settings: { isCached: false }
  // },
]

export default routes
