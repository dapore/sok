import {
  length,
  compose,
  prop,
  isNotNilOrEmpty,
  defaultTo
} from '@meltwater/phi'
import { map as mapAwait, success } from 'awaiting'
import { createDeleteObject, createListFromS3 } from './util/client/s3'
import createLogger from './util/logger'

export const asyncMute = run => input => success(run(input))

export default options => async () => {
  const log = createLogger('CleanIndex')
  log('Cleaning')
  const { bucket, indexName } = options
  const cntrl = { nextToken: undefined }

  const getRecords = nextToken => createListFromS3(options)({
    Bucket: bucket,
    Prefix: `${indexName}`,
    ContinuationToken: nextToken,
    MaxKeys: 1000
  })
  const deleteRecord = key => createDeleteObject(options)({ Bucket: bucket, Key: key })
  const hasMoreRecords = () => isNotNilOrEmpty(cntrl.nextToken)
  do {
    const {
      Contents: _contents,
      NextContinuationToken: ctToken
    } = await getRecords(cntrl.nextToken)
    const contents = defaultTo([], _contents)
    log('length', length(contents))
    cntrl.nextToken = ctToken
    await mapAwait(contents, length(contents), compose(deleteRecord, prop('Key')))
  } while (hasMoreRecords())
  return { status: true, msg: 'done' }
}
