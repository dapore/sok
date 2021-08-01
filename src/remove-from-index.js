import {
  length,
  when,
  isNotNilOrEmpty,
  compose,
  fromJson
} from '@meltwater/phi'
import { success, map as mapAwait } from 'awaiting'
import createRecordKey from './util/get-record-key'
import { createDeleteObject, createGetObject } from './util/client/s3'
import getVariantKeysFromRecord from './util/get-variant-keys-from-record'
import createLogger from './util/logger'

export const createDeleteVariants = options => async record => {
  const log = createLogger('DeleteRecordVariant')
  const {
    bucket,
    indexName,
    searchOptions: { variant: variantPrefix }
  } = options
  const variantKeys = getVariantKeysFromRecord(record, indexName, variantPrefix)
  log('Variant keys', length(variantKeys))
  const deleteOldRecord = createDeleteObject(options)
  const deleteOldRecordHandler = key => success(deleteOldRecord({ Bucket: bucket, Key: key }))
  await mapAwait(variantKeys, length(variantKeys), deleteOldRecordHandler)
}

export const createDeleteRecord = options => async uuid => {
  const log = createLogger('DeleteRecord')
  log('Deleting', uuid)
  const { bucket } = options
  const key = createRecordKey(options)({ uuid })
  log('Using key', key)
  const record = await success(createGetObject(options)({
    Key: key,
    Bucket: bucket
  }))
  await when(
    isNotNilOrEmpty,
    compose(createDeleteVariants(options), fromJson)
  )(record)
  await createDeleteObject(options)({ Key: key, Bucket: bucket })
}

export default options => async (...ids) => {
  const log = createLogger('DeleteFromIndex')
  log('Deleting', ids)
  const deleteRecord = createDeleteRecord(options)
  await mapAwait(ids, length(ids), compose(deleteRecord))
  return { status: true }
}
