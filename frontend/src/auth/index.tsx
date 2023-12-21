import React, { useState, createContext, useEffect, useCallback } from 'react'

import axiosInstance from 'api/config.api'

import { getUserIdFromToken } from './helpers'

import { getUser } from 'api/user'

import { friendsStatusSocket } from 'socket'

interface User {
  username: string
  email: string
  nickname: string
  id: number
  token?: string
  isTwoFactorAuthenticationEnabled: boolean
  avatar: string | null
}

interface AuthContextProps {
  user: User | null
  signIn: (userData: User) => void
  signOut: () => void
  setToken: (token: string) => void
  refreshUser: () => void
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  signIn: () => {},
  signOut: () => {},
  setToken: () => {},
  refreshUser: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const refreshUser = useCallback(async () => {
    if (!user?.id) return
    const userData = await getUser(user.id)

    setUser((prevUser: any) => ({...prevUser, ...userData}))
  }, [user?.id])

  const setToken = useCallback(async (token: string) => {
	// Set token in the localStorage for reloads of the app
    localStorage.setItem('token', token)

	// Set token in the axios default headers for future requests
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`

	// Get user data from the API
	const userId = getUserIdFromToken(token)
	const userData = await getUser(userId)

	// Send user status online
	friendsStatusSocket.emit(
      'statusRouter',
      JSON.stringify({
        userId: userId,
        status: 'online',
      }),
    )

    setUser({ ...userData, token })
  }, [setUser])
 	
  useEffect(() => {
	const token = localStorage.getItem('token')
	if (token) {
	  setToken(token)
	}
  }, [setToken])

  const signIn = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('user')
	localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, setToken, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
