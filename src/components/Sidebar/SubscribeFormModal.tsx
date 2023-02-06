import { Modal, Text, Input, Radio, Button } from '@nextui-org/react'
import { useAtom } from 'jotai'
import React, { memo } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { subscribedAtom } from '../../atom'
import type { SerchQuery } from '../../atom'
import type { UseModalHandlersReturnValues } from '../../hooks/useModalControl'

interface Props {
  isModalVisible: UseModalHandlersReturnValues['isModalVisible']
  closeModal: UseModalHandlersReturnValues['closeModal']
}

interface FormData {
  username: SerchQuery['username']
  selectedTimeline: SerchQuery['selectedTimeline']
}

const SubscribeFormModal: React.FC<Props> = memo(
  ({ isModalVisible, closeModal }) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>({
      defaultValues: {
        selectedTimeline: 'PullRequestAndIssueComments',
        username: '',
      },
    })

    const [subscribed, setSubscribed] = useAtom(subscribedAtom)
    const onSubmit = (data: FormData) => {
      setSubscribed([
        ...subscribed,
        { selectedTimeline: data.selectedTimeline, username: data.username },
      ])
      closeModal()
    }

    return (
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isModalVisible}
        onClose={closeModal}
      >
        <Modal.Header>
          <Text id="modal-title" b size={18}>
            Enter GitHub Username
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
                    <Radio value="PullRequestAndIssueComments">
                      PullRequest & Issue Comments
                    </Radio>
                    <Radio value="discussionComments">
                      Disscussion Comments
                    </Radio>
                  </Radio.Group>

                  {errors.selectedTimeline && (
                    <Text color="error">required</Text>
                  )}
                </>
              )}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" auto>
              Add
            </Button>
            <Button auto flat color="error" onPress={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    )
  }
)

SubscribeFormModal.displayName = 'SubscribeModal'

export default SubscribeFormModal
