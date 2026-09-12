import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from '../auth';
import { api, DEMO_MODE } from '../api';

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(!DEMO_MODE);
    const [error, setError] = useState('');

    const refreshUser = useCallback(async () => {
        if (DEMO_MODE) return null;
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get('/users/me');
            if (!data?.id) throw new Error('Invalid session response');
            setUser(data);
            return data;
        } catch (err) {
            setUser(null);
            if (![401, 403].includes(err.response?.status)) {
                setError('We couldn’t check your session. Please try again.');
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { refreshUser(); }, [refreshUser]);

    const logout = async () => {
        await api.post('/logout');
        setUser(null);
        setError('');
    };

    return <AuthContext.Provider value={{ user, loading, error, refreshUser, logout }}>{children}</AuthContext.Provider>;
}
