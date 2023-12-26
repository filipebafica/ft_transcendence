import React, { createContext, useState, useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

interface SnackMessage {
  message: string
  severity: 'success' | 'info' | 'warning' | 'error'
  key?: number
}

export const SnackbarContext = createContext({
  showSnackbar: (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {},
})

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export const SnackbarProvider = ({ children }: { children: any }) => {
  const [snackPack, setSnackPack] = useState<SnackMessage[]>([])
  const [open, setOpen] = useState(false)
  const [messageInfo, setMessageInfo] = useState<SnackMessage | undefined>(undefined)

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo(snackPack[0])
      setSnackPack((prev) => prev.slice(1))
      setOpen(true)
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false)
    }
  }, [snackPack, messageInfo, open])

  const handleSnackbarClose = () => {
    setOpen(false)
  }

  const handleExited = () => {
    setMessageInfo(undefined)
  }

  const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    setSnackPack((prev) => [...prev, { message, severity }])
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        TransitionProps={{ onExited: handleExited }}
      >
        <Alert onClose={handleSnackbarClose} severity={messageInfo?.severity}>
          {messageInfo ? messageInfo.message : undefined}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
