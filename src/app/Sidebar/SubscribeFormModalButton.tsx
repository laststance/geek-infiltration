import { Button } from '@mui/material'
import React, { memo } from 'react'

import type useModalControl from '../../hooks/useModalControl'

interface Props {
  openModal: ReturnType<typeof useModalControl>['openModal']
}
const SubscribeFormModalButton: React.FC<Props> = memo(({ openModal }) => {
  return (
    <Button
      sx={{
        borderRadius: '15px',
        borderWidth: '3px',
        fontSize: '35px',
        maxHeight: '46px',
        maxWidth: '46px',
        minHeight: '46px',
        minWidth: '46px',
        padding: 0,
      }}
      variant="outlined"
      onClick={openModal}
    >
      +
    </Button>
  )
})
SubscribeFormModalButton.displayName = 'SubscribeFormModalButton'

export default SubscribeFormModalButton
