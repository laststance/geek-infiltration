import { Button } from '@nextui-org/react'
import React, { memo } from 'react'

import type { UseModalHandlersReturnValues } from '../../hooks/useModalControl'

interface Props {
  openModal: UseModalHandlersReturnValues['openModal']
}
const OpenSubscribeFormModalButton: React.FC<Props> = memo(({ openModal }) => {
  return (
    <Button
      auto
      size="md"
      color="gradient"
      shadow
      css={{ border: 0, fontSize: '30px', padding: '0 15px' }}
      onPress={openModal}
    >
      +
    </Button>
  )
})
OpenSubscribeFormModalButton.displayName = 'OpenSubscribeFormModalButton'

export default OpenSubscribeFormModalButton
