import { curry, __ } from '@meltwater/phi'

export const changeEncoding = (val, from, to) => Buffer.from(val, from).toString(to)
export const toBase64 = curry(changeEncoding)(__, 'utf-8', 'base64')
export const fromBase64 = curry(changeEncoding)(__, 'base64', 'utf-8')
