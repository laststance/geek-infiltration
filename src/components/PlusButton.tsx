import { Button } from '@nextui-org/react'
import React, { memo } from 'react'

const PlusButton = () => (
  <Button
    auto
    size="md"
    color="gradient"
    shadow
    css={{ border: 0, fontSize: '30px', padding: '0 15px' }}
  >
    +
  </Button>
)

export default memo(PlusButton)
