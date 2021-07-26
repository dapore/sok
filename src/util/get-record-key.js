export default ({
  indexName,
  searchOptions: { rawPath, fileExtension = '.json' }
}) => record => {
  const { uuid } = record
  return `${indexName}/${rawPath}/${uuid}${fileExtension}`
}
