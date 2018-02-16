/*import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  // AxiosResponse
} from 'axios'
import { Schema } from 'jsonschema'
import { BaseController } from 'lexpress'

const HTTP_STATUS_CREATED: number = 201

export default class ApiSubscriberController extends BaseController {
  private getMailchimpApiBaseUri(): string {
    return [
      process.env.MAILCHIMP_API_URI,
      process.env.MAILCHIMP_API_VERSION
    ].join('/')
  }

  public get(): void {
    // tslint:disable:object-literal-sort-keys
    const schema: Schema = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['email'],
    }
    // tslint:enable:object-literal-sort-keys

    this.validateJsonSchema(schema, (): void => {
      const axiosConfig: AxiosRequestConfig = {
        auth: {
          password: process.env.MAILCHIMP_API_BASIC_AUTH_PASSWORD,
          username: process.env.MAILCHIMP_API_BASIC_AUTH_USERNAME,
        },
        baseURL: this.getMailchimpApiBaseUri(),
      }

      const axiosInstance: AxiosInstance = Axios.create(axiosConfig)

      const data: {
        email_address: string
        status: 'subscribed'
      } = {
        email_address: this.req.query.email,
        status: 'subscribed',
      }

      axiosInstance.post('/lists/463b259249/members/', data)
        .then(() => {
          this.res
            .status(HTTP_STATUS_CREATED)
            .json({
              email: this.req.query.email,
            })
        })
        .catch((err: AxiosError): void => {
          if (err.response.data.title === 'Member Exists') {
            this.res
              .status(HTTP_STATUS_CREATED)
              .json({
                email: this.req.query.email,
              })

            return
          }

          this.answerError(
            `Mailchimp API: ${err.response.data.title}`,
            err.response.status
          )
        })
    })
  }
}
*/
