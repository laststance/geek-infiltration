/**
 * Returns a new array with item1 and item2 swapped by value identity.
 *
 * Used when callers need a non-mutating reorder of two known elements.
 *
 * @returns A shallow copy of arr with the two items exchanged.
 *
 * @example
 * ```ts
 * swap(['a', 'b', 'c'], 'a', 'c') // ['c', 'b', 'a']
 * ```
 */
export function swap<T>(arr: Array<T>, item1: T, item2: T): Array<T> {
  const item1Index = arr.indexOf(item1)
  const item2Index = arr.indexOf(item2)
  const res = [...arr]

  // Exchange the two positions on the copy so the original array stays untouched.
  res[item1Index] = arr[item2Index]
  res[item2Index] = arr[item1Index]

  return res
}
