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
import React, { memo, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { useAppDispatch } from '../../hooks/useAppDispatch'
import type { UseModalHandlersReturnValues } from '../../hooks/useModalControl'

import { subscribe } from './subscribedSlice'

export type SearchQuery = {
  username: string
  selectedTimeline: 'PullRequest_Issue_Comments' | 'discussionComments'
}
interface Props {
  isModalVisible: UseModalHandlersReturnValues['isModalVisible']
  closeModal: UseModalHandlersReturnValues['closeModal']
}

const SubscribeFormModal: React.FC<Props> = memo(
  ({ isModalVisible, closeModal }) => {
    const dispatch = useAppDispatch()
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<SearchQuery>({
      defaultValues: {
        selectedTimeline: 'PullRequest_Issue_Comments',
        username: '',
      },
    })

    const onSubmit = useCallback(
      (data: SearchQuery) => {
        dispatch(subscribe(data))
        closeModal()
      },
      [dispatch]
    )

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
