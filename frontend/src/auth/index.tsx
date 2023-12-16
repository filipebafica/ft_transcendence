import React, { useState, createContext } from 'react';

interface User {
	name: string;
	email: string;
	password: string;
	id: string;
}

interface AuthContextProps {
	user: User | null;
	signIn: (userData: User) => void;
	signOut: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
	user: null,
	signIn: () => {},
	signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem('user');
		return savedUser ? JSON.parse(savedUser) : null;
	  });

	const signIn = (userData: User) => {
		setUser(userData);
  		localStorage.setItem('user', JSON.stringify(userData));
	};

	const signOut = () => {
		setUser(null);
		localStorage.removeItem('user');
	};

	return (
		<AuthContext.Provider value={{ user, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};