import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
    email: string;
    fullName: string | null;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    userId: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwtSub(token: string | null): string | null {
    try {
        if (!token) return null;

        // JWT token'ının payload (orta) kısmını al
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        // Base64URL string'ini çözülebilir Base64 string'ine çevir
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // UTF-8 karakterlerini sorunsuz çöz
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const parsed = JSON.parse(jsonPayload);

        // JWT içinden ID değerini oku (sub, id veya .NET claim yapıları)
        const resolvedId = 
            parsed?.sub ?? 
            parsed?.id ?? 
            parsed?.userId ?? 
            parsed?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        return resolvedId ? String(resolvedId) : null;
    } catch (error) {
        console.error("Failed to decode JWT token:", error);
        return null;
    }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const userId = useMemo(() => decodeJwtSub(token), [token]);

    const login = (token: string, user: User) => {
        setToken(token);
        setUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const isAuthenticated = () => !!token;

    return (
        <AuthContext.Provider value={{ user, token, userId, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};