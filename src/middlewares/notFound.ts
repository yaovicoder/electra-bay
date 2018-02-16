import { Request, Response } from 'lexpress'

const CACHE_EXPIRATION_IN_SECONDS: number = 60
const HTTP_STATUS_CODE_NOT_FOUND: number = 404

export default function(req: Request, res: Response): void {
  (res.status(HTTP_STATUS_CODE_NOT_FOUND) as Response)
    .cache(CACHE_EXPIRATION_IN_SECONDS)
    .render('404')
}
