import { BaseController } from 'lexpress'

export default class LogOutController extends BaseController {
  public get(): void {
    this.req.logout()
    this.res.redirect('/')
  }
}
