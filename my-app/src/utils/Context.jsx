import React, { createContext, useContext, useState, useEffect } from "react";

const authContext = createContext();

export const useAuth = () => {
    return useContext(authContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        email: localStorage.getItem('userEmail') || '',
        token: localStorage.getItem('token') || '' // Initialize token state
    });

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        const storedToken = localStorage.getItem('token'); // Get token from localStorage
        if (storedEmail && storedToken) {
            setUser({ email: storedEmail, token: storedToken }); // Set email and token
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('token', userData.token); // Store token in localStorage
        setUser({ email: userData.email, token: userData.token }); // Set email and token
    }

    const logout = () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('token'); // Remove token on logout
        setUser({ email: '', token: '' }); // Clear email and token
    }

    return (
        <authContext.Provider value={{ user, login, logout }}>
            {children}
        </authContext.Provider>
    )
}
