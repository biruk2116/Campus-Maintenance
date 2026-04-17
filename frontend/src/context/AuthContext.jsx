import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Theme Management - Persistent in localStorage
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newValue = !prev;
            localStorage.setItem('theme', newValue ? 'dark' : 'light');
            return newValue;
        });
    };

    const checkSession = async () => {
        try {
            const res = await axios.get('index.php?action=checkSession');
            if (res.data.success) {
                setUser(res.data.data);
            }
        } catch (err) {
            console.warn("User not logged in");
        } finally {
            setLoading(false);
        }
    };

    const login = async (user_code, password) => {
        const formData = new URLSearchParams();
        formData.append('user_code', user_code);
        formData.append('password', password);
        
        const res = await axios.post('index.php?action=login', formData);
        if (res.data.success) {
            setUser(res.data.data);
            return res.data;
        } else {
            throw new Error(res.data.message || 'Login failed');
        }
    };

    const logout = async () => {
        try {
            await axios.post('index.php?action=logout');
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        // Apply theme attribute to body for CSS variable targeting
        const theme = isDarkMode ? 'dark' : 'light';
        document.body.setAttribute('data-bs-theme', theme);
        
        // Also update standard body classes for potential Bootstrap overrides
        if (isDarkMode) {
            document.body.classList.add('bg-dark');
            document.body.classList.remove('bg-light');
        } else {
            document.body.classList.add('bg-light');
            document.body.classList.remove('bg-dark');
        }
    }, [isDarkMode]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isDarkMode, toggleDarkMode }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
