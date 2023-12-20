import React, { useState, createContext } from 'react';

import axiosInstance from 'api/config.api';

interface User {
	name: string;
	email: string;
	password: string;
	id: string;
	token?: string;
}

interface AuthContextProps {
	user: User | null;
	signIn: (userData: User) => void;
	signOut: () => void;
	setToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextProps>({
	user: null,
	signIn: () => {},
	signOut: () => {},
	setToken: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem('user');
		return savedUser ? JSON.parse(savedUser) : null;
	  });

	const setToken = (token: string) => {
		setUser({ ...user, token });
		localStorage.setItem('token', token);
		axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
	}

	const signIn = (userData: User) => {
		setUser(userData);
  		localStorage.setItem('user', JSON.stringify(userData));
	};

	const signOut = () => {
		setUser(null);
		localStorage.removeItem('user');
	};

	return (
		<AuthContext.Provider value={{ user, signIn, signOut, setToken }}>
			{children}
		</AuthContext.Provider>
	);
};