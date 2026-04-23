import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null)

export function AuthProvider({ children }) 
{
    const [auth, setAuth] = useState(() => {
      const stored = localStorage.getItem("cronsentry_auth");
      return stored ? JSON.parse(stored) : null;
    });

    const login = (data) => {
        setAuth(data)
        localStorage.setItem("cronsentry_auth", JSON.stringify(data))
    }

    const logout = () => {
        setAuth(null)
        localStorage.removeItem("cronsentry_auth")
    }

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}