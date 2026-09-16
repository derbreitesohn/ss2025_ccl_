import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FaPaw, FaDog, FaCat } from 'react-icons/fa';
import { FiSearch, FiMapPin, FiMessageCircle } from 'react-icons/fi';
import Navbar from './Navbar';
import Footer from './Footer';
import ListingCard from './ListingCard';
import { useAuth } from '../auth';
import { api, loginPath } from '../api';
import { getListings } from '../listings';
import fee from '../images/fee_ccl.png';
import './HomePage.css';

const species = [['all', 'All pets', FaPaw], ['dog', 'Dogs', FaDog], ['cat', 'Cats', FaCat]];
const normalize = value => String(value || '').trim().toLowerCase();

export default function HomePage() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [saving, setSaving] = useState(null);
    const [favoriteError, setFavoriteError] = useState('');
    const { user, loading: authLoading, refreshUser } = useAuth();
    const [params] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const animal = ['dog', 'cat'].includes(params.get('animal')) ? params.get('animal') : 'all';
    const purpose = ['playdate', 'adoption'].includes(params.get('purpose')) ? params.get('purpose') : 'all';
    const query = params.get('q') || '';
    const browsePath = location.pathname + location.search + '#browse';

    const load = useCallback(async (signal) => {
        setLoading(true);
        setError('');
        try { setListings(await getListings(signal)); }
        catch (err) { if (!signal?.aborted && err.code !== 'ERR_CANCELED') setError('We couldn’t load the pets just now. Please try again in a moment.'); }
        finally { if (!signal?.aborted) setLoading(false); }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        load(controller.signal);
        return () => controller.abort();
    }, [load]);

    useEffect(() => {
        if (!user) { setFavoriteIds([]); return; }
        const controller = new AbortController();
        api.get('/favorites', { signal: controller.signal })
            .then(({ data }) => setFavoriteIds(data.favorites.map(favorite => String(favorite.id))))
            .catch(err => { if (err.code !== 'ERR_CANCELED') setFavoriteError('Saved pets couldn’t be loaded. Please refresh to try again.'); });
        return () => controller.abort();
    }, [user]);

    const updateFilter = (key, value) => {
        const next = new URLSearchParams(params);
        if (value && value !== 'all') next.set(key, value); else next.delete(key);
        navigate({ search: next.toString(), hash: location.hash }, { replace: true, preventScrollReset: true });
    };
    const clearFilters = () => navigate({ search: '', hash: location.hash }, { replace: true, preventScrollReset: true });
    const matchesPurpose = listing => purpose === 'all' || normalize(listing.listing_type) === purpose;
    const filtered = listings.filter(listing =>
        matchesPurpose(listing) && (animal === 'all' || normalize(listing.animal) === animal) &&
        normalize([listing.pet_name, listing.breed, listing.location].join(' ')).includes(normalize(query)));
    const hasFilters = animal !== 'all' || purpose !== 'all' || query;

    const toggleFavorite = async id => {
        if (!user) { navigate(loginPath(browsePath, 'save')); return; }
        setSaving(id);
        setFavoriteError('');
        try {
            const saved = favoriteIds.includes(String(id));
            if (saved) await api.delete(`/favorites/${id}`);
            else await api.post(`/favorites/${id}`);
            setFavoriteIds(previous => saved ? previous.filter(value => value !== String(id)) : [...previous, String(id)]);
        } catch (err) {
            if ([401, 403].includes(err.response?.status)) {
                await refreshUser();
                navigate(loginPath(browsePath, 'save'));
            } else setFavoriteError('That change couldn’t be saved. Please try again.');
        } finally { setSaving(null); }
    };

    return <><Navbar /><main>
        <section className="home-hero page-shell" aria-labelledby="home-heading">
            <div className="hero-copy">
                <h1 id="home-heading">Little paws.<br /><span>Big connections.</span></h1>
            </div>
            <div className="hero-photo">
                <img src={fee} alt="Fee, a black Labrador, relaxing at home" fetchPriority="high" />
            </div>
        </section>
        <div className="page-shell">
            <section id="browse" className="browse-section" aria-labelledby="browse-heading">
                <div className="section-heading"><div><h2 id="browse-heading">A new friend could be right here.</h2></div>{user && <Link className="pat-button secondary" to="/add-listing">+ Create a listing</Link>}</div>
                <div className="browse-toolbar">
                    <div className="species-filters" role="group" aria-label="Filter by pet">
                        {species.map(([value, label, Icon]) => <button key={value} className={animal === value ? 'selected' : ''} aria-pressed={animal === value} onClick={() => updateFilter('animal', value)}><Icon aria-hidden="true" />{label}<span>{loading || error ? '–' : listings.filter(listing => matchesPurpose(listing) && (value === 'all' || normalize(listing.animal) === value)).length}</span></button>)}
                    </div>
                    <div className="browse-controls"><label className="search-field"><FiSearch aria-hidden="true" /><span className="sr-only">Search pets by name, breed, or location</span><input type="search" placeholder="Name, breed or location" value={query} onChange={e => updateFilter('q', e.target.value)} /></label><label className="purpose-select"><span className="sr-only">Listing type</span><select aria-label="Listing type" value={purpose} onChange={e => updateFilter('purpose', e.target.value)}><option value="all">All connections</option><option value="playdate">Playdates</option><option value="adoption">Adoption</option></select></label></div>
                </div>
                {favoriteError && <p className="notice error" role="alert">{favoriteError}</p>}
                {loading ? <div className="listing-grid" aria-label="Loading pets" aria-busy="true">{Array.from({ length: 4 }, (_, i) => <div key={i} className="listing-skeleton"><div /><span /><span /><span /></div>)}</div> :
                    error ? <div className="state-panel" role="alert"><FaPaw aria-hidden="true" /><h3>The pets are taking a little break.</h3><p>{error}</p><button className="pat-button" onClick={() => load()}>Try again</button></div> :
                    filtered.length ? <><div className="listing-grid">{filtered.map(listing => <ListingCard key={listing.id} listing={listing} favorite={favoriteIds.includes(String(listing.id))} busy={saving !== null || authLoading} onFavorite={toggleFavorite} browsePath={browsePath} own={user && String(user.id) === String(listing.user_id)} />)}</div><div className="results-note" role="status">{filtered.length} {filtered.length === 1 ? 'companion' : 'companions'} to get to know{hasFilters && <button onClick={clearFilters}>Clear filters</button>}</div></> :
                    <div className="state-panel"><FiSearch aria-hidden="true" /><h3>{hasFilters ? 'No paws found just yet.' : 'Every connection starts with a hello.'}</h3><p>{hasFilters ? 'Try another name or location, or broaden your filters.' : 'There are no listings yet. Share a pet to help the first connection happen.'}</p>{hasFilters ? <button className="pat-button secondary" onClick={clearFilters}>Clear filters</button> : <Link className="pat-button" to="/add-listing">Create the first listing</Link>}</div>}
            </section>
        </div>
        <section className="how-section" id="how-it-works" aria-labelledby="how-heading"><div className="page-shell">
            <div className="section-heading"><div><h2 id="how-heading">From a little hello to a happy connection.</h2></div></div>
            <div className="how-grid">{[
                [FiSearch, '01', 'Explore at your own pace', 'Browse playdates and adoption listings. See who catches your eye, without signing up.'],
                [FiMessageCircle, '02', 'Say hello', 'Create an account to save your favorites, ask questions, and get to know the person behind the pet.'],
                [FiMapPin, '03', 'Make a connection', 'Arrange a meet-up together and see if it’s a match. A little care goes a long way.'],
            ].map(([Icon, number, title, text]) => <div className="how-step" key={number}><div className="step-top"><span className="option-icon"><Icon aria-hidden="true" /></span><span>{number}</span></div><h3>{title}</h3><p>{text}</p></div>)}</div>
            {!user && <div className="join-banner"><div><h3>Got a little love to share?</h3></div><Link className="pat-button" to="/signup">Create an account</Link></div>}
        </div></section>
    </main><Footer /></>;
}
