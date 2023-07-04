import DeleteIcon from '@mui/icons-material/Delete'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

interface Props {
  handleClick: () => void
}
const RemoveMenuItem: React.FC<Props> = ({ handleClick }) => {
  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText>delete</ListItemText>
    </MenuItem>
  )
}
RemoveMenuItem.displayName = 'RemoveMenuItem'

export default RemoveMenuItem
