import axios from 'axios';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;
export const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true, timeout: 10000 });

// Preserve the destination through sign-in, registration, and a page refresh.
export function returnPath(search) {
    const next = new URLSearchParams(search).get('next');
    return next?.startsWith('/') && !next.startsWith('//') && !next.includes('\\') &&
        !/^\/(login|signup)([/?#]|$)/.test(next) ? next : '/';
}

export function loginPath(next, reason) {
    const params = new URLSearchParams({ next });
    if (reason) params.set('reason', reason);
    return `/login?${params}`;
}
