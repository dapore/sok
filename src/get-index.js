import createAddToIndex from './add-to-index'
import createDeleteObject from './remove-from-index'
import createSearch from './search-in-index'

export default options => indexName => {
  return ({
    search: createSearch({ ...options, indexName }),
    // clean: createCleanIndex(),
    // getObject: createGetObject(),
    addToIndex: createAddToIndex({ ...options, indexName }),
    deleteObjects: createDeleteObject({ ...options, indexName })
  })
}
