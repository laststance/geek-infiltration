import { swap } from './swap'

describe('swap', () => {
  test('swap item1 and item2', () => {
    const arr = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }]
    const res = swap(arr, arr[0], arr[2])
    expect(res).toEqual([{ c: 3 }, { b: 2 }, { a: 1 }, { d: 4 }])
  })
  test.skip('', () => {})
  test.skip('', () => {})
  test.skip('', () => {})
  test.skip('', () => {})
  test.skip('', () => {})
})
