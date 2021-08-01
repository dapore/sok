import createAddToIndex from './add-to-index'
import createDeleteObject from './remove-from-index'
import createSearch from './search-in-index'
import createCleanIndex from './clean-index'

export default options => indexName => {
  return ({
    search: createSearch({ ...options, indexName }),
    clean: createCleanIndex({ ...options, indexName }),
    addObjects: createAddToIndex({ ...options, indexName }),
    deleteObjects: createDeleteObject({ ...options, indexName })
  })
}
