import test from 'ava'
import { toBase64, fromBase64, changeEncoding } from './string-encoding'

test('Check decode data to string', t => {
  t.snapshot(changeEncoding('dGVzdDFAZ21haWwuY29t', 'base64', 'utf-8'))
  t.snapshot(changeEncoding('test@example.com', 'utf-8', 'base64'))
})

test('Check to base64', t => {
  t.snapshot(toBase64('test@example.com'))
})

test('Check from base64', t => {
  t.snapshot(fromBase64('dGVzdDFAZ21haWwuY29t'))
})
