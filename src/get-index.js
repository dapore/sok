import createAddToIndex from './add-to-index'

export default options => indexName => {
  return ({
    // search: createSearch({}),
    // clean: createCleanIndex(),
    // getObject: createGetObject(),
    addToIndex: createAddToIndex({ ...options, indexName })
  })
}
