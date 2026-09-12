import { api, DEMO_MODE } from './api';

export async function getListings(signal) {
    if (DEMO_MODE) return (await import('./data/demoListings')).demoListings;
    const { data } = await api.get('/listings', { signal });
    if (!Array.isArray(data.listings)) throw new Error('Invalid listings response');
    return data.listings;
}

export async function getListing(id, signal) {
    if (DEMO_MODE) return (await import('./data/demoListings')).demoListings.find(listing => listing.id === id) || null;
    const { data } = await api.get(`/listings/${encodeURIComponent(id)}`, { signal });
    if (!Object.hasOwn(data, 'listing')) throw new Error('Invalid listing response');
    return data.listing;
}
