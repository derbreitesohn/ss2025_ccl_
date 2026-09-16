import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FiMapPin, FiMessageCircle } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';
import PetPhoto from './PetPhoto';
import { getListing } from '../listings';
import { useAuth } from '../auth';
import './ListingDetail.css';

export default function ListingDetail() {
    const { id } = useParams();
    const location = useLocation();
    const { user } = useAuth();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);
    const back = location.state?.from === 'my-listings' ? '/listings' : location.state?.browsePath || '/#browse';

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError('');
        getListing(id, controller.signal)
            .then(data => { if (!controller.signal.aborted) setListing(data); })
            .catch(err => {
                if (!controller.signal.aborted) {
                    if (err.response?.status === 404) setListing(null);
                    else setError('We couldn’t load this pet’s details. Please try again.');
                }
            })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, [id, attempt]);

    const own = user && listing && String(user.id) === String(listing.user_id);
    return <><Navbar /><main className="page-shell listing-detail-page">
        <Link className="text-link detail-back" to={back}>{back === '/listings' ? 'Back to my listings' : 'Back to the pets'}</Link>
        {loading || error || !listing ? <div className="state-panel" role="status"><FaPaw aria-hidden="true" /><h1>{loading ? 'Getting to know this companion…' : error ? 'Let’s try that again' : 'This listing is no longer here.'}</h1><p>{error || (!loading && 'There are more companions waiting to meet you.')}</p>{error && <button className="pat-button" onClick={() => setAttempt(value => value + 1)}>Try again</button>}{!loading && !error && <Link className="pat-button" to="/#browse">Explore other pets</Link>}</div> :
        <article className="public-detail-card">
            <div className="public-detail-photo"><PetPhoto src={listing.photo_url} name={listing.pet_name} eager /><span className={`listing-kind ${listing.listing_type}`}>{listing.listing_type || 'Companion'}</span></div>
            <div className="public-detail-body">
                <div className="public-detail-heading"><div><p className="listing-location"><FiMapPin aria-hidden="true" />{listing.location || 'Location not shared'}</p><h1>{listing.pet_name}</h1></div><span className="detail-purpose">{listing.listing_type === 'adoption' ? 'Looking for a loving home' : 'Looking for a new friend'}</span></div>
                <dl className="public-detail-facts">{[['Age', listing.age], ['Gender', listing.gender], ['Weight', listing.weight], ['Color', listing.color], ['Breed', listing.breed], ['Animal', listing.animal]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not shared yet'}</dd></div>)}</dl>
                <h2>A little about {listing.pet_name}</h2><p className="detail-about">{listing.about || 'Their person hasn’t added a description yet. Say hello to learn more.'}</p>
                <div className="detail-contact"><div><h2>{own ? 'This is your listing.' : 'Could this be a happy connection?'}</h2><p>{own ? 'Keep their details up to date so people can get to know them.' : 'Say hello, ask a few questions, and take it from there.'}</p></div><Link className="pat-button" to={own ? `/listings/${id}/edit` : `/messages?user=${listing.user_id}`}>{own ? 'Edit listing' : <><FiMessageCircle aria-hidden="true" />{user ? 'Contact owner' : 'Log in to say hello'}</>}</Link></div>
            </div>
        </article>}
    </main><Footer /></>;
}
