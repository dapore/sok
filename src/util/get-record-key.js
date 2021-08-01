import { toLower } from '@meltwater/phi'
export default ({
  indexName,
  searchOptions: { rawPath, fileExtension = '.json' }
}) => record => {
  const { uuid } = record
  return `${indexName}/${rawPath}/${uuid}${fileExtension}`
}

export const createGetSearchPrefix = ({
  indexName,
  searchOptions: { variant }
}) => (searchTerm = '') => `${indexName}/${variant}/${toLower(searchTerm)}`
