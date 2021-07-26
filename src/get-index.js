import createAddToIndex from './add-to-index'
import createDeleteObject from './remove-from-index'

export default options => indexName => {
  return ({
    // search: createSearch({}),
    // clean: createCleanIndex(),
    // getObject: createGetObject(),
    addToIndex: createAddToIndex({ ...options, indexName }),
    deleteObjects: createDeleteObject({ ...options, indexName })
  })
}
