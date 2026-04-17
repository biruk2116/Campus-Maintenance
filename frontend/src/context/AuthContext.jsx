import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Default to dark mode for SaaS premium Feel
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
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
        // Enforce dark theme at body level
        document.body.setAttribute('data-bs-theme', 'dark');
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isDarkMode, toggleDarkMode }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
