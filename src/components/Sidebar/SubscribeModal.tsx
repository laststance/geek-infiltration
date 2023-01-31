import { Modal, Text, Input, Radio, Button } from '@nextui-org/react'
import React, { memo } from 'react'
import { useForm, Controller } from 'react-hook-form'

import type { ValidSerchQuery } from '../../atom'
import type { UseModalHandlersReturnValues } from '../../hooks/useModalHandlers'

interface Props {
  isVisible: UseModalHandlersReturnValues['isVisible']
  onClose: UseModalHandlersReturnValues['onClose']
}

const SubscribeModal: React.FC<Props> = memo(({ isVisible, onClose }) => {
  const { control, handleSubmit } = useForm<{
    username: ValidSerchQuery['username']
    selectedTimeline: ValidSerchQuery['selectedTimeline']
  }>({
    defaultValues: {
      selectedTimeline: 'issueComments',
      username: '',
    },
  })

  // eslint-disable-next-line no-console
  const onSubmit = (data: any) => console.log(data)

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isVisible}
      onClose={onClose}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Input{' '}
          <Text b size={18}>
            GitHub Username
          </Text>
        </Text>
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                aria-label="username"
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder="ryota-murakami"
              />
            )}
          />
          <Controller
            name="selectedTimeline"
            control={control}
            render={({ field }) => (
              <Radio.Group
                {...field}
                label="Timeline"
                defaultValue="issueComments"
              >
                <Radio value="issueComments">Issue Comments</Radio>
                <Radio value="PRComments">PR Comments</Radio>
                <Radio value="discussionComments">Disscussion Comments</Radio>
              </Radio.Group>
            )}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" auto>
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
