import { useState } from 'react';
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import AuthLayout from './AuthLayout';
import { useAuth } from '../auth';
import { api, DEMO_MODE, returnPath } from '../api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const { user, refreshUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const next = returnPath(location.search);
    const params = new URLSearchParams(location.search);
    const reason = params.get('reason');
    const subtitle = reason === 'save' ? 'Log in to keep your favorite companions close.' :
        next.startsWith('/messages') ? 'Log in to say hello and get to know their person.' :
        next.startsWith('/add-') ? 'Log in to introduce your pet to the community.' : '';

    const handleLogin = async event => {
        event.preventDefault();
        setError('');
        if (DEMO_MODE) { setError('Accounts aren’t available just yet. You can still explore the pets.'); return; }
        setBusy(true);
        try {
            const { data } = await api.post('/login', { username: username.trim(), password });
            if (data.Login !== 'success') { setError('That username and password don’t match. Please try again.'); return; }
            const current = await refreshUser();
            if (!current) { setError('We couldn’t finish signing you in. Please try again.'); return; }
            navigate(next, { replace: true });
        } catch (err) {
            setError([401, 403].includes(err.response?.status) ? 'That username and password don’t match. Please try again.' : 'We couldn’t connect right now. Please try again in a moment.');
        } finally { setBusy(false); }
    };

    if (user) return <Navigate to={next} replace />;
    return <AuthLayout>
        <div className="eyebrow">Welcome to PatPat</div>
        <h1>Good to see you again.</h1>{subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {params.get('registered') === '1' && <p className="notice" role="status">Your account is ready. Log in to get started.</p>}
        {error && <p className="notice error" role="alert">{error}</p>}
        <form onSubmit={handleLogin}>
            <label className="auth-field">Username<input name="username" autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} required placeholder="Your username" /></label>
            <label className="auth-field" htmlFor="login-password">Password</label>
            <div className="password-field"><input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required placeholder="Your password" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>
            <button className="pat-button auth-submit" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        </form>
        <p className="auth-footer">New to PatPat? <Link to={`/signup${location.search}`}>Create an account</Link></p>
        <p className="auth-browse-note">Just looking? <Link to="/#browse">Keep exploring without an account.</Link></p>
    </AuthLayout>;
}
