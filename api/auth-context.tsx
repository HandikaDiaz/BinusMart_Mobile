import type { User } from '@/constants/type';
import { AuthContext } from '@/hooks/auth/use-auth';
import { getItem, removeItem, setItem } from '@/utils/storage';
import { jwtDecode } from 'jwt-decode';
import { ReactNode, useEffect, useState } from 'react';

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const token = await getItem('token');

            if (!token) {
                setIsLoading(false);
                return;
            }

            const decoded = jwtDecode<User>(token);
            setUser(decoded);
        } catch {
            await removeItem('token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (token: string) => {
        await setItem('token', token);
        await checkAuth();
    };

    const logout = async () => {
        await removeItem('token');
        setUser(null);
    };

    const updateUser = (userData: Partial<User>) => {
        setUser(prev => (prev ? { ...prev, ...userData } : prev));
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}
