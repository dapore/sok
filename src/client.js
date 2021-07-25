import createGetIndex from './get-index'
import createS3Client from './util/client/s3'
/**
 * Create search client powered by aws s3
 * @param { s3, searchOptions } s3 is from https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientresolvedconfig.html
 * search
 * @returns { getindex } An object with getIndex method
 */
export default ({
  s3,
  searchOptions
}) => {
  const { bucket } = s3
  const s3Client = createS3Client({ s3 })
  const getIndex = createGetIndex({ client: s3Client, bucket, searchOptions })
  return ({ getIndex })
}
