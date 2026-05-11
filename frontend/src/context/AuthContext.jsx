/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';
import { normalizeAuthUser } from '../utils/authRoutes';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkSession = async () => {
        try {
            const res = await axios.get('index.php?action=checkSession');
            if (res.data.success) {
                setUser(normalizeAuthUser(res.data.data));
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
        try {
            const res = await axios.post('index.php?action=login', { user_code, password });

            if (!res.data.success) {
                throw new Error(res.data.message || 'Login failed');
            }

            if (res.data.data?.must_change_password === 1) {
                setUser(null);
                return res.data;
            }

            setUser(normalizeAuthUser(res.data.data));
            return res.data;
        } catch (error) {
            // Enhanced error handling
            console.error('Login error:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                console.error('No response received:', error.request);
            }
            throw error;
        }
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
            localStorage.clear();
            setUser(null);
            window.location.href = '/';
        }
    };

    useEffect(() => {
        void (async () => {
            await checkSession();
        })();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                logout,
                updatePassword,
                loading,
                checkSession
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
