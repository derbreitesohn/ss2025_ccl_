import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import Navbar from './Navbar';
import ListingCard from './ListingCard';
import { api } from '../api';
import { useAuth } from '../auth';

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [animalTab, setAnimalTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(null);
    const { user } = useAuth();
    const matches = (listing, tab) => tab === 'all' || String(tab === 'dog' || tab === 'cat' ? listing.animal : listing.listing_type).trim().toLowerCase() === tab;
    const filtered = favorites.filter(listing => matches(listing, animalTab));

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get('/favorites');
            if (!Array.isArray(data.favorites)) throw new Error('Invalid favorites response');
            setFavorites(data.favorites);
        } catch { setError('Your favorites couldn’t be loaded. Please try again.'); }
        finally { setLoading(false); }
    }, []);
    useEffect(() => { load(); }, [load]);

    const remove = async id => {
        setSaving(id);
        try {
            await api.delete(`/favorites/${id}`);
            setFavorites(previous => previous.filter(listing => listing.id !== id));
        } catch { setError('That pet couldn’t be removed. Please try again.'); }
        finally { setSaving(null); }
    };

    return <><Navbar /><main className="page-shell" style={{ paddingTop: 36, paddingBottom: 60 }}>
        <div className="section-heading"><div><h1>My Favorites</h1><p>A few companions you’d like to get to know.</p></div><Link className="pat-button secondary" to="/#browse">Explore more pets</Link></div>
        {error && <p className="notice error" role="alert">{error} <button className="pat-button secondary" onClick={load}>Try again</button></p>}
        {loading ? <div className="state-panel" role="status">Loading your favorites…</div> : <>
            {!error && favorites.length === 0 ? <div className="state-panel"><FiHeart aria-hidden="true" /><h2>Keep your favorites close.</h2><p>Tap the heart on a pet’s card and you’ll find them here.</p><Link className="pat-button" to="/#browse">Meet the pets</Link></div> : <>
                <div className="species-filters" role="group" aria-label="Filter favorites" style={{ flexWrap: 'wrap', marginBottom: 24 }}>{[['all', 'All'], ['dog', 'Dogs'], ['cat', 'Cats'], ['playdate', 'Playdates'], ['adoption', 'Adoption']].map(([value, label]) => <button key={value} className={animalTab === value ? 'selected' : ''} aria-pressed={animalTab === value} onClick={() => setAnimalTab(value)}>{label} ({favorites.filter(listing => matches(listing, value)).length})</button>)}</div>
                {filtered.length ? <div className="listing-grid">{filtered.map(listing => <ListingCard key={listing.id} listing={listing} favorite busy={saving !== null} onFavorite={remove} browsePath="/favorites" own={String(user.id) === String(listing.user_id)} />)}</div> : !error && <div className="state-panel"><h2>No favorites in this filter.</h2><button className="pat-button secondary" onClick={() => setAnimalTab('all')}>Show all favorites</button></div>}
            </>}
        </>}
    </main></>;
}
