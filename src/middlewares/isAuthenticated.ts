import { NextFunction, Request, Response } from 'lexpress'

export default function(req: Request, res: Response, next: NextFunction): void {
  if (req.user === undefined || !req.user.isActivated) {
    res.redirect('/')

    return
  }

  next()
}
