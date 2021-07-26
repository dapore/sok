import {
  keys,
  omit,
  when,
  compose,
  toString,
  length,
  flip,
  toLower,
  concat,
  chain,
  prop,
  map,
  not,
  is
} from '@meltwater/phi'

const conditionallyToString = when(compose(not, is(String)), toString)
export const getSubstrings = (str = '') => [...Array(length(str))].map((_, index) => str.substring(index))
export default (record, indexName, prefix) => {
  const { uuid } = record
  const attributes = keys(omit(['uuid'], record))
  const getVariantKeys = attribute => {
    const value = conditionallyToString(prop(attribute, record))
    const strs = getSubstrings(value)
    const addPathMetadata = flip(concat)(`:${attribute}:${uuid}`)
    return map(compose(toLower, addPathMetadata), strs)
  }
  const variantKeys = chain(getVariantKeys, attributes)
  return map(concat(`${indexName}/${prefix}/`), variantKeys)
}
