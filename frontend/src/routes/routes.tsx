import { createBrowserRouter } from 'react-router-dom'

import GamePage from '../components/GamePage'
import LoginPage from '../components/LoginPage'
import ChatPage from '../components/ChatPage'
import App from '../App'

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/game',
    Component: GamePage,
  },
  {
	path: '/chat',
	Component: ChatPage,
  },
])

export default router
