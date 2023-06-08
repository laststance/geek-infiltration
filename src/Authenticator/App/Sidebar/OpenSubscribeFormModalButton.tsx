import { Button } from '@mui/material'
import React, { memo } from 'react'

import type { UseModalHandlersReturnValues } from '../../../hooks/useModalControl'

interface Props {
  openModal: UseModalHandlersReturnValues['openModal']
}
const OpenSubscribeFormModalButton: React.FC<Props> = memo(({ openModal }) => {
  return (
    <Button
      sx={{ border: 0, fontSize: '30px', padding: '0 15px' }}
      onClick={openModal}
    >
      +
    </Button>
  )
})
OpenSubscribeFormModalButton.displayName = 'OpenSubscribeFormModalButton'

export default OpenSubscribeFormModalButton
