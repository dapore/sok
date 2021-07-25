import test from 'ava'
import createLogger from './logger'

test('Check logger creation', async t => {
  t.truthy(createLogger)
  const logger = createLogger('TestingLogger')
  t.truthy(logger)
})
