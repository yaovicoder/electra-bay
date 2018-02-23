import * as aws from 'aws-sdk'
import * as dotenv from 'dotenv'

import { AwsUploadFile } from './types'

dotenv.config()

const s3: aws.S3 = new aws.S3({
  apiVersion: '2006-03-01',
})

// tslint:disable:no-unnecessary-class
export default class AwsClient {
  public static async upload(file: AwsUploadFile): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (err: Error) => void): void => {
      s3.upload(
        {
          Key: file.name,
          Body: file.source,
          Bucket: process.env.AWS_S3_BUCKET_NAME
        },
        (err: Error) => {
          if (err !== null) {
            reject(err)

            return
          }

          resolve()
        }
      )
    })
  }

  public static async uploadMany(files: AwsUploadFile[]): Promise<void[]> {
    return Promise.all(files.map(this.upload))
  }
}
