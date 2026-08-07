export function swap(arr, item1, item2) {
  const item1Index = arr.indexOf(item1)
  const item2Index = arr.indexOf(item2)
  const res = [...arr]

  res[item1Index] = arr[item2Index]
  res[item2Index] = arr[item1Index]

  return res
}
