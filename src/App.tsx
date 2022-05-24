import { Grid } from '@nextui-org/react'
import React from 'react'

import Sidebar from './components/Sidebar'

function App() {
  return (
    <Grid.Container as="main" wrap="nowrap" css={{ h: '100%' }}>
      <Grid css={{ h: '100%', w: '60px' }}>
        <Sidebar />
      </Grid>
      <h1>App</h1>
    </Grid.Container>
  )
}

export default App
