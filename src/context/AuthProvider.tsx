import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { type AuthContextType, type User, type UserLevel, ACCESS_HIERARCHY } from '../types/UserTypes';
import { simulateLogin } from '../utils/mockUsers';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('aerocodeUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser) as User);
            } catch (e) {
                console.error('Erro ao carregar usuário do localStorage:', e);
                localStorage.removeItem('aerocodeUser');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        setLoading(true);
        const loggedUser = await simulateLogin(username, password);
        if (loggedUser) {
            setUser(loggedUser);
            localStorage.setItem('aerocodeUser', JSON.stringify(loggedUser));
            setLoading(false);
            return true;
        }
        setUser(null);
        localStorage.removeItem('aerocodeUser');
        setLoading(false);
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('aerocodeUser');
    };

    const hasPermission = (requiredLevel: UserLevel): boolean => {
        if (!user) return false;
        const userIndex = ACCESS_HIERARCHY.indexOf(user.level);
        const requiredIndex = ACCESS_HIERARCHY.indexOf(requiredLevel);
        return userIndex !== -1 && requiredIndex !== -1 && userIndex <= requiredIndex;
    };

    const contextValue: AuthContextType = {
        user,
        loading,
        login,
        logout,
        USER_LEVELS: {
            ADMIN: 'administrador',
            ENGINEER: 'engenheiro',
            OPERATOR: 'operador'
        },
        hasPermission,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};