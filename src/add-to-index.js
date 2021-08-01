import { v4 as getUuid } from 'uuid'
import {
  toJson,
  length,
  compose,
  prop,
  map,
  isNotNilOrEmpty,
  when
} from '@meltwater/phi'
import { map as mapAwait, success } from 'awaiting'
import { createPutToS3 } from './util/client/s3'
import getVariantKeysFromRecord from './util/get-variant-keys-from-record'
import createRecordKey from './util/get-record-key'
import createDeleteOldRecord from './remove-from-index'
import createLogger from './util/logger'

export const createSaveVariants = options => async record => {
  const log = createLogger('SaveVariants')
  const {
    client,
    bucket,
    indexName,
    searchOptions: { variant: variantPrefix }
  } = options
  const variantKeys = getVariantKeysFromRecord(record, indexName, variantPrefix)
  log(length(variantKeys))
  const zeroFileSize = ''
  await mapAwait(variantKeys, length(variantKeys), async key => createPutToS3({ client })({
    Body: zeroFileSize,
    ContentType: 'search/variant',
    Bucket: bucket,
    Key: key
  }))
  log('Done saving')
  return true
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

export default options => async (...objs) => {
  const log = createLogger('AddToIndex')
  log('Start adding')
  const saveRecord = createSaveRecord(options)
  const deleteOldRecord = when(isNotNilOrEmpty, createDeleteOldRecord(options))
  const removeOldRecord = compose(deleteOldRecord, prop('uuid'))
  const handleRecord = compose(saveRecord, addIdToRecord)
  await mapAwait(objs, length(objs), asyncMute(removeOldRecord))
  const objects = map(addIdToRecord, objs)
  await mapAwait(objects, length(objects), handleRecord)
  log('Done adding')
  return { status: objects }
}
