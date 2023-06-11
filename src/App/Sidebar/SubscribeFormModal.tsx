import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography as Text,
  Radio,
  Button,
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
import type { SearchQuery } from '../../atom'
import type { UseModalHandlersReturnValues } from '../../hooks/useModalControl'

interface Props {
  isModalVisible: UseModalHandlersReturnValues['isModalVisible']
  closeModal: UseModalHandlersReturnValues['closeModal']
}

interface FormData {
  username: SearchQuery['username']
  selectedTimeline: SearchQuery['selectedTimeline']
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
      <Dialog open={isModalVisible} onClose={closeModal}>
        <DialogTitle>Enter GitHub Username</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={1}>
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
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button type="submit">Add</Button>
            <Button onClick={closeModal}>Close</Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
)

SubscribeFormModal.displayName = 'SubscribeModal'

export default SubscribeFormModal
