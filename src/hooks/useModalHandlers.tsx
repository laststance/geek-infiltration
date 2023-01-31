import { useState, useCallback } from 'react'
export interface UseModalHandlersReturnValues {
  isVisible: boolean
  onOpen: () => void
  onClose: () => void
}

const useModalHandlers = (): UseModalHandlersReturnValues => {
  const [isVisible, setIsVisible] = useState(false)

  const onOpen = useCallback(() => setIsVisible(true), [])
  const onClose = useCallback(() => {
    setIsVisible(false)
  }, [])
  return { isVisible, onClose, onOpen }
}

export default useModalHandlers
