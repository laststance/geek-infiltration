import { Toolbar } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  '@media (min-width: 0)': {
    border: `solid 2px ${theme.palette.grey[800]}`,
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(0.5),
    maxHeight: '48px',
    minHeight: '48px',
  },
}))
StyledToolbar.displayName = 'StyledToolbar'

export default StyledToolbar
