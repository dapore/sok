import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
export * from '@aws-sdk/client-s3'

/**
 * Create an s3 client
 * @param {} Get full list of params here https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientresolvedconfig.html
 * @returns s3 client
 */
export default ({ s3 }) => new S3Client(s3)

export const createListFromS3 = ({
  client
}) => options => client.send(new ListObjectsV2Command(options))

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/modules/putobjectrequest.html
export const createPutToS3 = ({
  client
}) => options => client.send(new PutObjectCommand(options))

export const createHeadBucket = ({
  client
}) => options => client.send(new HeadBucketCommand(options))

export const createHeadObject = ({
  client
}) => options => client.send(new HeadObjectCommand(options))

export const createGetObject = ({
  client
}) => options => client.send(new GetObjectCommand(options))

export const createDeleteObject = ({
  client
}) => options => client.send(new DeleteObjectCommand(options))
