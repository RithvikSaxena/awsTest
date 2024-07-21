import React, { createContext, useContext, useState, useEffect } from "react";

const authContext = createContext();

export const useAuth = () => {
    return useContext(authContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        email: localStorage.getItem('userEmail') || ''
    });

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setUser({ email: storedEmail });
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('userEmail', userData.email);
        setUser({ email: userData.email });
    }

    const logout = () => {
        localStorage.removeItem('userEmail');
        setUser({ email: '' });
    }

    return (
        <authContext.Provider value={{ user, login, logout }}>
            {children}
        </authContext.Provider>
    )
}
