import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router-dom'

// Api
import { initializeAxiosAuthToken } from 'api/config.api'

// Auth

import { AuthProvider } from './auth'

// Custom providers

import { DirectChatProvider } from './providers/directChat'
import { InviteMatchProvider } from './providers/inviteMatch'
import { RoomChatProvider } from './providers/roomChat'
import { SnackbarProvider } from './providers/snackBar'

// Routes

import router from './routes/routes'

import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#2e2c33',
    },
    secondary: {
      main: '#5386ac',
    },
  },
  typography: {
    fontFamily: ['Fredoka'].join(','),
    button: {
      textTransform: 'none',
    },
  },
}

const theme = createTheme(themeOptions)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

initializeAxiosAuthToken()

root.render(
  <AuthProvider>
    <SnackbarProvider>
      <DirectChatProvider>
        <RoomChatProvider>
          <InviteMatchProvider>
            <ThemeProvider theme={theme}>
              <RouterProvider router={router} />
            </ThemeProvider>
          </InviteMatchProvider>
        </RoomChatProvider>
      </DirectChatProvider>
    </SnackbarProvider>
  </AuthProvider>,
)
