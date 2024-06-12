import React, {createContext, useContext, useState} from "react";

const authContext = createContext();

export const useAuth = () => {
    return useContext(authContext);
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState({
        email: ''
    });

    const login = (userData) => {
        setUser({
            email: userData.email
        });
    }

    const logout = () => {
        setUser({
            email: ''
        });
    }

    return (
        <authContext.Provider value={{user, login, logout}}>
            {children}
        </authContext.Provider>
    )
}

