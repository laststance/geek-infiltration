import { Modal, Text, Input, Radio, Button } from '@nextui-org/react'
import { useAtom } from 'jotai'
import React, { memo } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { subscribedAtom } from '../../atom'
import type { ValidSerchQuery } from '../../atom'
import type { UseModalHandlersReturnValues } from '../../hooks/useModalHandlers'

interface Props {
  isVisible: UseModalHandlersReturnValues['isVisible']
  onClose: UseModalHandlersReturnValues['onClose']
}

interface FormData {
  username: ValidSerchQuery['username']
  selectedTimeline: ValidSerchQuery['selectedTimeline']
}

const SubscribeFormModal: React.FC<Props> = memo(({ isVisible, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      selectedTimeline: 'issueComments',
      username: '',
    },
  })

  const [subscribed, setSubscribed] = useAtom(subscribedAtom)
  const onSubmit = (data: FormData) => {
    setSubscribed([
      ...subscribed,
      { selectedTimeline: data.selectedTimeline, username: data.username },
    ])
  }

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
            rules={{ required: true }}
            control={control}
            render={({ field }) => (
              <>
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
                {errors.username && <Text color="error">required</Text>}
              </>
            )}
          />
          <Controller
            name="selectedTimeline"
            rules={{ required: true }}
            control={control}
            render={({ field }) => (
              <>
                <Radio.Group
                  {...field}
                  label="Timeline"
                  defaultValue="issueComments"
                >
                  <Radio value="issueComments">Issue Comments</Radio>
                  <Radio value="PRComments">PR Comments</Radio>
                  <Radio value="discussionComments">Disscussion Comments</Radio>
                </Radio.Group>

                {errors.selectedTimeline && <Text color="error">required</Text>}
              </>
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

SubscribeFormModal.displayName = 'SubscribeModal'

export default SubscribeFormModal
