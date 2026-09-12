import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth';
import { loginPath } from '../api';
import Navbar from './Navbar';

export default function RequireAuth() {
    const { user, loading, error, refreshUser } = useAuth();
    const location = useLocation();
    if (loading || error) return <><Navbar /><main className="page-shell"><div className="state-panel" role="status">
        <h1>{loading ? 'Getting things ready…' : 'Let’s try that again'}</h1>
        <p>{loading ? 'Checking your session.' : error}</p>
        {!loading && <><button className="pat-button" onClick={refreshUser}>Try again</button> <Link className="pat-button secondary" to="/">Keep browsing</Link></>}
    </div></main></>;
    return user ? <Outlet /> : <Navigate to={loginPath(location.pathname + location.search + location.hash, 'account')} replace />;
}
