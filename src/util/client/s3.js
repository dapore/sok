import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import createLogger from '../logger'

export * from '@aws-sdk/client-s3'

/**
 * Create an s3 client
 * @param {} Get full list of params here https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientresolvedconfig.html
 * @returns s3 client
 */
export default ({ s3 }) => new S3Client(s3)
/**
 * List items from s3
 * @param {*} param0 come from https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/listobjectsv2commandinput.html
 * @returns { Contents, ...}
 */
export const createListFromS3 = ({
  bucket,
  client
}) => options => client.send(new ListObjectsV2Command({ Bucket: bucket, ...options }))

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/modules/putobjectrequest.html
export const createPutToS3 = ({
  bucket,
  client
}) => options => client.send(new PutObjectCommand({ Bucket: bucket, ...options }))

export const createHeadBucket = ({
  bucket,
  client
}) => options => client.send(new HeadBucketCommand({ Bucket: bucket, ...options }))

export const createHeadObject = ({
  bucket,
  client
}) => options => client.send(new HeadObjectCommand({ Bucket: bucket, ...options }))

export const createGetObject = ({
  bucket,
  client
}) => async options => {
  const log = createLogger('GetObject')
  log(options)
  const streamToString = stream => new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
  const { Body: stream } = await client.send(new GetObjectCommand({ Bucket: bucket, ...options }))
  return streamToString(stream)
}

export const createDeleteObject = ({
  bucket,
  client
}) => options => client.send(new DeleteObjectCommand({ Bucket: bucket, ...options }))
