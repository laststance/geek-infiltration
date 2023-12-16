import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
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

import Text from '@/components/Text'

import { useAppDispatch } from '../../hooks/useAppDispatch'
import type useModalControl from '../../hooks/useModalControl'
import { subscribe } from '../../redux/subscribedSlice'

export type UserSearchGQLParams = {
  information: TimelineProperty['information']
  user: NonNullable<TimelineProperty['aim']['user']>
}

interface Props {
  closeModal: ReturnType<typeof useModalControl>['closeModal']
  isModalVisible: ReturnType<typeof useModalControl>['isModalVisible']
}

const SubscribeFormModal: React.FC<Props> = memo(
  ({ closeModal, isModalVisible }) => {
    const dispatch = useAppDispatch()
    const {
      control,
      formState: { errors },
      handleSubmit,
    } = useForm<UserSearchGQLParams>({
      defaultValues: {
        information: 'PR_Issues',
        user: '',
      },
    })

    const onSubmit = (data: UserSearchGQLParams) => {
      const tp: Omit<TimelineProperty, 'id'> = {
        aim: { user: data.user },
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
