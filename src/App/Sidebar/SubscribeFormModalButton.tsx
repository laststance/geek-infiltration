import { Button } from '@mui/material'
import React, { memo } from 'react'

import type { UseModalHandlersReturnValues } from '../../hooks/useModalControl'

interface Props {
  openModal: UseModalHandlersReturnValues['openModal']
}
const SubscribeFormModalButton: React.FC<Props> = memo(({ openModal }) => {
  return (
    <Button
      sx={{
        borderRadius: '15px',
        borderWidth: '3px',
        fontSize: '35px',
        padding: 0,
      }}
      variant="outlined"
      style={{
        maxHeight: '46px',
        maxWidth: '46px',
        minHeight: '46px',
        minWidth: '46px',
      }}
      onClick={openModal}
    >
      +
    </Button>
  )
})
SubscribeFormModalButton.displayName = 'SubscribeFormModalButton'

export default SubscribeFormModalButton
