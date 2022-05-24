import React, { memo } from 'react'
import { CircleLoader } from 'react-spinners'

const Loading: React.FC = memo(
  () => {
    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <CircleLoader size={250} color="#9CA3AF" />
      </div>
    )
  },
  () => true
)
Loading.displayName = 'Loading'

export default Loading
