// @mui
import { List, Box, ListSubheader } from '@mui/material'
import { styled } from '@mui/material/styles'

//
import { NavListRoot } from './NavList'
import type { NavSectionProps } from './type'

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => (
  <ListSubheader disableSticky disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.overline,
  color: theme.palette.text.primary,
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingTop: theme.spacing(3),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}))

// ----------------------------------------------------------------------

export default function NavSection({
  navConfig,
  isCollapse = false,
  ...other
}: NavSectionProps) {
  return (
    <Box {...other}>
      {navConfig.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          {/* @ts-expect-error TODO */}
          <ListSubheaderStyle
            sx={{
              ...(isCollapse && {
                opacity: 0,
              }),
            }}
          >
            {group.subheader}
          </ListSubheaderStyle>

          {group.items.map((list) => (
            <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
          ))}
        </List>
      ))}
    </Box>
  )
}
