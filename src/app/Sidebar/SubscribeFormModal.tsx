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
import React, { memo } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { useAppDispatch } from '../../hooks/useAppDispatch'
import type { UseModalHandlersReturnValues } from '../../hooks/useModalControl'
import { subscribe } from '../../redux/subscribedSlice'

export type UserSearchQuery = {
  information: TimelineProperty['information']
  user: TimelineProperty['target']['user']
}

interface Props {
  closeModal: UseModalHandlersReturnValues['closeModal']
  isModalVisible: UseModalHandlersReturnValues['isModalVisible']
}

const SubscribeFormModal: React.FC<Props> = memo(
  ({ closeModal, isModalVisible }) => {
    const dispatch = useAppDispatch()
    const {
      control,
      formState: { errors },
      handleSubmit,
    } = useForm<UserSearchQuery>({
      defaultValues: {
        information: 'PR_Issues',
        user: '',
      },
    })

    const onSubmit = (data: UserSearchQuery) => {
      const tp: TimelineProperty = {
        target: { user: data.user },
        information: data.information,
      }
      dispatch(subscribe(tp))
      closeModal()
    }

    return (
      <Dialog open={isModalVisible} onClose={closeModal}>
        <DialogTitle>Enter GitHub Username</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={1}>
              <Controller
                name="user"
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      aria-label="user"
                      fullWidth
                      color="primary"
                      placeholder="@user"
                    />
                    {errors.user && <Text color="error">required</Text>}
                  </>
                )}
              />

              <Controller
                name="information"
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <RadioGroup {...field}>
                      <FormControlLabel
                        value="PR_Issues"
                        control={<Radio />}
                        label="PullRequest & Issue Comments"
                      />
                      <FormControlLabel
                        value="Discussion"
                        control={<Radio />}
                        label="Disscussion Comments"
                      />
                      {errors.information && (
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
  },
)

SubscribeFormModal.displayName = 'SubscribeModal'

export default SubscribeFormModal
