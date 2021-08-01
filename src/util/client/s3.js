import { S3 } from 'aws-sdk'
export default ({ s3 }) => new S3(s3)
export const createListFromS3 = ({
  bucket,
  client
}) => options => client.listObjectsV2({ Bucket: bucket, ...options }).promise()

export const createHeadBucket = ({
  bucket,
  client
}) => options => client.headBucket({ Bucket: bucket, ...options }).promise()

export const createHeadObject = ({
  bucket,
  client
}) => options => client.headObject({ Bucket: bucket, ...options }).promise()

export const createGetObject = ({
  bucket,
  client
}) => options => client.getObject({ Bucket: bucket, ...options }).promise()

export const createPutToS3 = ({
  bucket,
  client
}) => options => client.putObject({ Bucket: bucket, ...options }).promise()

export const createDeleteObject = ({
  bucket,
  client
}) => options => client.deleteObject({ Bucket: bucket, ...options }).promise()
