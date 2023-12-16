import { Toolbar } from '@mui/material'
import { styled } from '@mui/material/styles'

const TimelineToolbar = styled(Toolbar)(({ theme }) => ({
  '@media (min-width: 0)': {
    border: `solid 2px ${theme.palette.grey[800]}`,
    borderRadius: theme.shape.borderRadius,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 0,
    paddingLeft: theme.spacing(1),
    marginTop: theme.spacing(0.5),
    maxHeight: '48px',
    minHeight: '48px',
  },
}))
TimelineToolbar.displayName = 'StyledToolbar'

export default TimelineToolbar
