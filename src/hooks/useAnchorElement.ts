import React, { useCallback } from 'react'

interface UseAnchorElementReturn {
  anchorEl: HTMLElement | null
  handleClick: (event: React.MouseEvent<HTMLElement>) => void
  handleClose: () => void
  open: boolean
}

/**
 * Use for MUI <Menu> components sate preparation
 * @see https://mui.com/material-ui/react-menu/
 */
function useAnchorElement(): UseAnchorElementReturn {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const open = Boolean(anchorEl)

  return {
    anchorEl,
    handleClick,
    handleClose,
    open,
  }
}

export default useAnchorElement
