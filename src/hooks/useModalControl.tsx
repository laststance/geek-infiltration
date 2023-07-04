import { useState, useCallback } from 'react'
export interface UseModalHandlersReturnValues {
  isModalVisible: boolean
  openModal: () => void
  closeModal: () => void
}

/**
 * Use for MUI <Modal /> components state preparation
 * @see https://mui.com/material-ui/react-modal/
 */
const useModalControl = (): UseModalHandlersReturnValues => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const openModal = useCallback(() => setIsModalVisible(true), [])
  const closeModal = useCallback(() => {
    setIsModalVisible(false)
  }, [])
  return { closeModal, isModalVisible, openModal }
}

export default useModalControl
