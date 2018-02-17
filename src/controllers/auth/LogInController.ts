import BaseController from '..'

export default class LogInController extends BaseController {
  public get(): void {
    this.render('auth/login')
  }
}
