import { map, split, uniq, length, fromJson } from '@meltwater/phi'
import { map as mapAwait } from 'awaiting'
import { createGetObject, createListFromS3 } from './util/client/s3'
import getRecordKey, { createGetSearchPrefix } from './util/get-record-key'
import createLogger from './util/logger'

export default options => async (searchTerm, otherOptions = {}) => {
  const log = createLogger('Searching')
  log('SearchTerm', searchTerm)
  const getObject = createGetObject(options)
  const listItems = createListFromS3(options)
  const prefix = createGetSearchPrefix(options)(searchTerm)
  const { continuationToken } = otherOptions
  const listParams = { Prefix: prefix, Maxkeys: 1000, ContinuationToken: continuationToken }
  const { Contents: ctx = [], NextContinuationToken: nxtToken } = await listItems(listParams)
  let { uuids = [], matchedFields = [] } = {}
  map(item => {
    // 'search-index-name-account-1/variant/april:firstname:f4cff850-8acf-48de-8003-3b0933d6ecb0'
    const [, , endPart] = split('/', item.Key)
    const [, fieldName, uuid] = split(':', endPart)
    uuids = uniq([...uuids, uuid])
    matchedFields = uniq([...matchedFields, fieldName])
  }, ctx)
  const records = await mapAwait(uuids, length(uuids), async uuid => {
    const record = await getObject({ Key: getRecordKey(options)({ uuid }) })
    return fromJson(record)
  })
  return { matchedFields, records, pagination: { nextContinuationToken: nxtToken } }
}
