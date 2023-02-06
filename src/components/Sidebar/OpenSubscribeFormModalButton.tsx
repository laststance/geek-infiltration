import { Button } from '@nextui-org/react'
import React, { memo } from 'react'

import type { UseModalHandlersReturnValues } from '../../hooks/useModalHandlers'

interface Props {
  onOpen: UseModalHandlersReturnValues['onOpen']
}
const OpenSubscribeFormModalButton: React.FC<Props> = memo(({ onOpen }) => {
  return (
    <Button
      auto
      size="md"
      color="gradient"
      shadow
      css={{ border: 0, fontSize: '30px', padding: '0 15px' }}
      onClick={onOpen}
    >
      +
    </Button>
  )
})
OpenSubscribeFormModalButton.displayName = 'OpenSubscribeFormModalButton'

export default OpenSubscribeFormModalButton
