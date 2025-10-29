import { useRef, useEffect, type DependencyList } from 'react'
/**
 * Simulate componentDidUpdate() method of Class Component
 * https://reactjs.org/docs/react-component.html#componentdidupdate
 */
const useDidUpdateEffect = (
  effect: () => void,
  deps: DependencyList | undefined = undefined,
): void => {
  const mounted = useRef<boolean>()
  useEffect(() => {
    if (!mounted.current) {
      // fire componentDidMount
      mounted.current = true
    } else {
      effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default useDidUpdateEffect
