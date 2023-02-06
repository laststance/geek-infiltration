import { useState, useCallback } from 'react'
export interface UseModalHandlersReturnValues {
  isModalVisible: boolean
  openModal: () => void
  closeModal: () => void
}

const useModalControl = (): UseModalHandlersReturnValues => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const openModal = useCallback(() => setIsModalVisible(true), [])
  const closeModal = useCallback(() => {
    setIsModalVisible(false)
  }, [])
  return { closeModal, isModalVisible, openModal }
}

export default useModalControl
