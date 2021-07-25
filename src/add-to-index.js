import { v4 as getUuid } from 'uuid'
import {
  toJson,
  length,
  compose,
  keys,
  prop,
  chain,
  toString,
  omit,
  when,
  not,
  is,
  concat,
  flip,
  map,
  toLower
} from '@meltwater/phi'
import { map as mapAwait } from 'awaiting'
import { createPutToS3 } from './util/client/s3'

const conditionallyToString = when(compose(not, is(String)), toString)
export const createRecordKey = ({
  indexName,
  searchOptions: { rawPath, fileExtension = '.json' }
}) => record => {
  const { uuid } = record
  return `${indexName}/${rawPath}/${uuid}${fileExtension}`
}

export const getSubstrings = (str = '') => [...Array(length(str))].map((_, index) => str.substring(index))

export const createSaveVariants = options => async record => {
  const {
    client,
    bucket,
    indexName,
    searchOptions: { variant: variantPrefix }
  } = options
  const { uuid } = record
  const attributes = keys(omit(['uuid'], record))
  const getVariantKeys = attribute => {
    const value = conditionallyToString(prop(attribute, record))
    const strs = getSubstrings(value)
    const addPathMetadata = flip(concat)(`:${attribute}:${uuid}`)
    return map(compose(toLower, addPathMetadata), strs)
  }
  const variantKeys = chain(getVariantKeys, attributes)
  const zeroFileSize = ''
  await mapAwait(variantKeys, length(variantKeys), async keyStub => {
    const key = `${indexName}/${variantPrefix}/${keyStub}`
    await createPutToS3({ client })({
      Body: zeroFileSize,
      Bucket: bucket,
      Key: key
    })
  })
  return variantKeys
}

export const createSaveRecord = options => async record => {
  const { client, bucket } = options
  const key = createRecordKey(options)(record)
  await createPutToS3({ client })({
    Body: toJson(record),
    Bucket: bucket,
    Key: key
  })
  await createSaveVariants(options)(record)
}

export const addIdToRecord = record => ({ ...record, uuid: getUuid() })
export default options => async (...objects) => {
  const { client, bucket, searchOptions, ...otherOptions } = options
  const saveRecord = createSaveRecord(options)
  const handleRecord = compose(saveRecord, addIdToRecord)
  await mapAwait(objects, length(objects), handleRecord)
  return { status: objects }
}
