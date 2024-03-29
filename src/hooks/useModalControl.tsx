import { useState, useCallback } from 'react'
interface Result {
  closeModal: () => void
  isModalVisible: boolean
  openModal: () => void
}

/**
 * Use for MUI <Modal /> components state preparation
 * @see https://mui.com/material-ui/react-modal/
 */
const useModalControl = (): Result => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const openModal = useCallback(() => setIsModalVisible(true), [])
  const closeModal = useCallback(() => {
    setIsModalVisible(false)
  }, [])
  return { closeModal, isModalVisible, openModal }
}

export default useModalControl
