import { Modal, Text, Input, Radio, Button } from '@nextui-org/react'
import React, { memo } from 'react'

import type { UseModalHandlersReturnValues } from '../../hooks/useModalHandlers'

interface Props {
  isVisible: UseModalHandlersReturnValues['isVisible']
  onClose: UseModalHandlersReturnValues['onClose']
}

const SubscribeModal: React.FC<Props> = memo(({ isVisible, onClose }) => {
  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isVisible}
      onClose={onClose}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Search{' '}
          <Text b size={18}>
            GitHub Username
          </Text>
        </Text>
      </Modal.Header>
      <form>
        <Modal.Body>
          <Input
            aria-label="userNameInput"
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="ryota-murakami"
          />

          <Radio.Group>
            <Radio value="issueComments">Issue Comments</Radio>
            <Radio value="PRComments">PR Comments</Radio>
            <Radio value="discussionComments">Disscussion Comments</Radio>
          </Radio.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" auto onPress={() => 'submit'}>
            Search
          </Button>
          <Button auto flat color="error" onPress={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
})

SubscribeModal.displayName = 'SubscribeModal'

export default SubscribeModal
