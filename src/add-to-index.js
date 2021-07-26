import { v4 as getUuid } from 'uuid'
import {
  toJson,
  length,
  compose,
  prop,
  map
} from '@meltwater/phi'
import { map as mapAwait, success } from 'awaiting'
import { createPutToS3 } from './util/client/s3'
import getVariantKeysFromRecord from './util/get-variant-keys-from-record'
import createRecordKey from './util/get-record-key'
import createDeleteOldRecord from './remove-from-index'

export const createSaveVariants = options => async record => {
  const {
    client,
    bucket,
    indexName,
    searchOptions: { variant: variantPrefix }
  } = options
  const variantKeys = getVariantKeysFromRecord(record, indexName, variantPrefix)
  const zeroFileSize = ''
  await mapAwait(variantKeys, length(variantKeys), async key => {
    await createPutToS3({ client })({
      Body: zeroFileSize,
      ContentType: 'search/variant',
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
    ContentType: 'application/json',
    Bucket: bucket,
    Key: key
  })
  await createSaveVariants(options)(record)
}

export const addIdToRecord = record => {
  const { uuid = getUuid() } = record
  return { ...record, uuid }
}

export const asyncMute = run => input => success(run(input))

export default options => async (..._objects) => {
  const saveRecord = createSaveRecord(options)
  const deleteOldRecord = createDeleteOldRecord(options)
  const removeOldRecord = compose(deleteOldRecord, prop('uuid'), addIdToRecord)
  const handleRecord = compose(saveRecord, addIdToRecord)
  const objects = map(addIdToRecord, _objects)
  await mapAwait(objects, length(objects), asyncMute(removeOldRecord))
  await mapAwait(objects, length(objects), handleRecord)
  return { status: objects }
}
