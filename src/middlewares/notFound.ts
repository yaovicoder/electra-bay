import { NextFunction, Request, Response } from 'lexpress'
import BaseController from '../controllers'

class NotFoundController extends BaseController {
  public get(): void {
    this.render('404')
  }
}

export default function(req: Request, res: Response, next: NextFunction): void {
  (new NotFoundController(req, res, next)).get()
}
