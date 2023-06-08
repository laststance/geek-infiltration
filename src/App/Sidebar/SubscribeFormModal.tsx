import {
  Modal,
  Typography as Text,
  Radio,
  Button,
  Box,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Stack,
} from '@mui/material'
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
        selectedTimeline: 'PullRequest_Issue_Comments',
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
      <Modal open={isModalVisible} onClose={closeModal} component="section">
        <Stack>
          <Text>Enter GitHub Username</Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="username"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <>
                  <TextField
                    {...field}
                    aria-label="username"
                    fullWidth
                    color="primary"
                    placeholder="@username"
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
                <FormControl>
                  <RadioGroup
                    defaultValue="PullRequest_Issue_Comments"
                    {...field}
                  >
                    <FormControlLabel
                      value="PullRequest_Issue_Comments"
                      control={<Radio />}
                      label="PullRequest & Issue Comments"
                    />
                    <FormControlLabel
                      value="discussionComments"
                      control={<Radio />}
                      label="Disscussion Comments"
                    />
                    {errors.selectedTimeline && (
                      <Text color="error">required</Text>
                    )}
                  </RadioGroup>
                </FormControl>
              )}
            />

            <Box>
              <Button type="submit">Add</Button>
              <Button onClick={closeModal}>Close</Button>
            </Box>
          </form>
        </Stack>
      </Modal>
    )
  }
)

SubscribeFormModal.displayName = 'SubscribeModal'

export default SubscribeFormModal
