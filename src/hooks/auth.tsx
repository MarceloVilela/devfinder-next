import React, { createContext, useCallback, useState, useContext, ReactNode } from 'react';
import api from '../services/api';
import { isServer } from '../utils';

interface AuthProviderProps {
    children: ReactNode;
}

export interface UserData {
    likes: string[];
    deslikes: string[];
    follow: string[];
    ignore: string[];
    _id: string;
    name: string;
    user: string;
    bio?: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
}

interface AuthData {
    token: string;
    user: UserData;
}

interface ReturnedCode {
    token: string;
}

interface AuthContextData {
    user: UserData;
    setUser(user: UserData): void;
    socialAuthCallback(data: AuthData): void;
    signOut(): void;
    message: {
        content?: string;
        type?: string;
    };
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [message] = useState({})
    const [data, setData] = useState<AuthData>(() => {
        if (isServer()) {
            return {} as AuthData;
        }

        const token = localStorage.getItem('@DevFinder:token');
        const user = localStorage.getItem('@DevFinder:user');

        if (token && user) {
            const userParsed = JSON.parse(user);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { token, user: userParsed };
        }

        return {} as AuthData;
    });

    const signOut = useCallback(() => {
        if (isServer()) return;

        localStorage.removeItem('@DevFinder:token');
        localStorage.removeItem('@DevFinder:user');

        setData({} as AuthData);
    }, [])

    const socialAuthCallback = useCallback(({ token, user }: {token: string, user: UserData}) => {
        if (isServer()) return;
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        localStorage.setItem('@DevFinder:token', token);
        localStorage.setItem('@DevFinder:user', JSON.stringify(user));

        setData({ token, user });

        return;
    }, [setData])

    const setUser = useCallback((user: UserData) => {
        if (isServer()) return;

        setData({
            token: data.token,
            user
        });

        localStorage.setItem('@DevFinder:user', JSON.stringify(user));
    }, [setData, data.token])

    return (
        <AuthContext.Provider value={{ user: data.user, setUser, signOut, socialAuthCallback, message }}>
            {children}
        </AuthContext.Provider>
    )
};

function useAuth() {
    const context = useContext<AuthContextData>(AuthContext);

    return context;
}

export { AuthProvider, useAuth }
