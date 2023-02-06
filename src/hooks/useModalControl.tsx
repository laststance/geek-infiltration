import { useState, useCallback } from 'react'
export interface UseModalHandlersReturnValues {
  isVisible: boolean
  openModal: () => void
  closeModal: () => void
}

const useModalControl = (): UseModalHandlersReturnValues => {
  const [isVisible, setIsVisible] = useState(false)

  const openModal = useCallback(() => setIsVisible(true), [])
  const closeModal = useCallback(() => {
    setIsVisible(false)
  }, [])
  return { closeModal, isVisible, openModal }
}

export default useModalControl
