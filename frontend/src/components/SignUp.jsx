import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import AuthLayout from './AuthLayout';
import { useAuth } from '../auth';
import { api, DEMO_MODE, returnPath } from '../api';

export default function SignUp() {
    const [form, setForm] = useState({ name: '', username: '', email: '', password: '', location: '', profile_picture: '', about: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const change = event => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));

    const submit = async event => {
        event.preventDefault();
        setError('');
        if (DEMO_MODE) { setError('Accounts aren’t available just yet. You can still explore the pets.'); return; }
        setBusy(true);
        try {
            const { data } = await api.post('/register', form);
            if (data.register !== 'DONE') throw new Error('Unexpected registration response');
            const params = new URLSearchParams(location.search);
            params.set('next', returnPath(location.search));
            params.set('registered', '1');
            navigate(`/login?${params}`, { replace: true });
        } catch (err) {
            setError(err.response?.status === 409 ? 'That username or email is already in use. Try another, or log in.' : 'We couldn’t create your account. Please check your details and try again.');
        } finally { setBusy(false); }
    };

    if (user) return <Navigate to={returnPath(location.search)} replace />;
    return <AuthLayout>
        <div className="eyebrow"><FaPaw aria-hidden="true" /> A place for you and your pet</div>
        <h1>Let’s make a connection.</h1><p className="auth-subtitle">Save a favorite. Say hello. Find your kind of company.</p>
        {error && <p className="notice error" role="alert">{error}</p>}
        <form onSubmit={submit}>
            <div className="auth-field-row"><label className="auth-field">Name<input name="name" autoComplete="name" value={form.name} onChange={change} required placeholder="Your name" /></label><label className="auth-field">Username<input name="username" autoComplete="username" value={form.username} onChange={change} required placeholder="Choose a username" /></label></div>
            <label className="auth-field">Email<input name="email" type="email" autoComplete="email" value={form.email} onChange={change} required placeholder="you@example.com" /></label>
            <label className="auth-field" htmlFor="signup-password">Password</label>
            <div className="password-field"><input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={change} required minLength={8} placeholder="At least 8 characters" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>
            <details className="auth-optional"><summary>Add a little about yourself <span>(optional)</span></summary><p>You can also fill these in on your profile later.</p>
                <label className="auth-field">Location<input name="location" autoComplete="address-level2" value={form.location} onChange={change} placeholder="Your town or city" /></label>
                <label className="auth-field">Profile picture URL<input name="profile_picture" type="url" value={form.profile_picture} onChange={change} placeholder="https://…" /></label>
                <label className="auth-field">About you<textarea name="about" rows="3" value={form.about} onChange={change} placeholder="Tell the community a little about you and your pet." /></label>
            </details>
            <button className="pat-button auth-submit" disabled={busy}>{busy ? 'Creating your account…' : 'Create an account'}</button>
        </form>
        <p className="auth-footer">Already part of the pack? <Link to={`/login${location.search}`}>Log in</Link></p>
        <p className="auth-browse-note">Just looking? <Link to="/#browse">Keep exploring without an account.</Link></p>
    </AuthLayout>;
}
