import { expect, test } from 'vitest'
import { useCounter } from './useCounter'

test('useCounter initializes with default value', () => {
  const { count } = useCounter()
  expect(count.value).toBe(0)
})

test('useCounter initializes with provided initial value', () => {
  const { count } = useCounter(5)
  expect(count.value).toBe(5)
})

test('increment method increases the count', () => {
  const { count, increment } = useCounter(2)
  increment()
  expect(count.value).toBe(3)
})

test('decrement method decreases the count', () => {
  const { count, decrement } = useCounter(2)
  decrement()
  expect(count.value).toBe(1)
})

test('reset method resets the count to initial value', () => {
  const { count, increment, reset } = useCounter(10)
  increment()
  increment()
  expect(count.value).toBe(12)
  reset()
  expect(count.value).toBe(10)
})

test('multiple increments and decrements work correctly', () => {
  const { count, increment, decrement } = useCounter(0)
  increment()
  increment()
  decrement()
  increment()
  expect(count.value).toBe(2)
})
