import type { DialogProps } from '@mui/material'
import { Dialog, Box, Paper } from '@mui/material'
import { m, AnimatePresence } from 'framer-motion'

// @mui
//
import { varFade } from './variants'

// ----------------------------------------------------------------------

export interface Props extends DialogProps {
  onClose?: VoidFunction
  variants?: Record<string, unknown>
}

export default function DialogAnimate({
  children,
  onClose,
  open = false,
  sx,
  variants,
  ...other
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={open}
          onClose={onClose}
          PaperComponent={(props) => (
            <Box
              component={m.div}
              {...(variants ||
                varFade({
                  distance: 120,
                  durationIn: 0.32,
                  durationOut: 0.24,
                  easeIn: 'easeInOut',
                }).inUp)}
              sx={{
                alignItems: 'center',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Box
                onClick={onClose}
                sx={{ height: '100%', position: 'fixed', width: '100%' }}
              />
              <Paper sx={sx} {...props}>
                {props.children}
              </Paper>
            </Box>
          )}
          {...other}
        >
          {children}
        </Dialog>
      )}
    </AnimatePresence>
  )
}
