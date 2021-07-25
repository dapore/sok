import test from 'ava'
import createS3Client, {
  createGetObject,
  createHeadBucket,
  createHeadObject,
  createListFromS3,
  createPutToS3,
  createDeleteObject
} from './s3'

test.beforeEach(async t => {
  const credentials = { accessKeyId: '*****', secretAccessKey: 'xxx-xxx-xxx-xxx' }
  const region = 'us-east-1'
  t.context.credentials = credentials
  t.context.region = region
})
test('Check s3 client', async t => t.snapshot(createS3Client({})))

test('Check list form s3', async t => {
  const client = {} // fake s3 client
  const listObjCommand = createListFromS3({ client })
  t.truthy(listObjCommand)
})

test('Check put into s3', async t => {
  const client = {} // fake s3 client
  const putToS3 = createPutToS3({ client })
  t.truthy(putToS3)
})

test('Check head bucket', async t => {
  const client = {} // fake s3 client
  const headBucket = createHeadBucket({ client })
  t.truthy(headBucket)
})

test('Check head object', async t => {
  const client = {} // fake s3 client
  const headObject = createHeadObject({ client })
  t.truthy(headObject)
})

test('Check get object', async t => {
  const client = {} // fake s3 client
  const getObject = createGetObject({ client })
  t.truthy(getObject)
})

test('Check delete object', async t => {
  const client = {} // fake s3 client
  const deleteObject = createDeleteObject({ client })
  t.truthy(deleteObject)
})
