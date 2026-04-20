/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const nextValue = !prev;
            localStorage.setItem('theme', nextValue ? 'dark' : 'light');
            return nextValue;
        });
    };

    const checkSession = async () => {
        try {
            const res = await axios.get('index.php?action=checkSession');
            if (res.data.success) {
                setUser(res.data.data);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (user_code, password) => {
        const res = await axios.post('index.php?action=login', { user_code, password });

        if (!res.data.success) {
            throw new Error(res.data.message || 'Login failed');
        }

        if (res.data.data?.must_change_password === 1) {
            setUser(null);
            return res.data;
        }

        setUser(res.data.data);
        return res.data;
    };

    const updatePassword = async ({ user_code, old_password, new_password }) => {
        const res = await axios.post('index.php?action=changePassword', {
            user_code,
            old_password,
            new_password
        });

        if (!res.data.success) {
            throw new Error(res.data.message || 'Password update failed');
        }

        return res.data;
    };

    const logout = async () => {
        try {
            await axios.post('index.php?action=logout');
        } finally {
            Object.keys(localStorage).forEach((key) => {
                if (key !== 'theme') localStorage.removeItem(key);
            });
            setUser(null);
            window.location.href = '/';
        }
    };

    useEffect(() => {
        void (async () => {
            await checkSession();
        })();
    }, []);

    useEffect(() => {
        const theme = isDarkMode ? 'dark' : 'light';
        document.body.setAttribute('data-bs-theme', theme);

        if (isDarkMode) {
            document.body.classList.add('bg-dark');
            document.body.classList.remove('bg-light');
        } else {
            document.body.classList.add('bg-light');
            document.body.classList.remove('bg-dark');
        }
    }, [isDarkMode]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                logout,
                updatePassword,
                loading,
                isDarkMode,
                toggleDarkMode,
                checkSession
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
