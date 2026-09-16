import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin } from 'react-icons/fi';
import PetPhoto from './PetPhoto';

export default function ListingCard({ listing, favorite, busy, onFavorite, browsePath, own }) {
    return <article className="listing-card">
        <div className="listing-card-photo">
            <Link to={`/listings/${listing.id}`} state={{ browsePath }} aria-label={`Meet ${listing.pet_name}`}><PetPhoto src={listing.photo_url} name={listing.pet_name} /></Link>
            <span className={`listing-kind ${listing.listing_type}`}>{listing.listing_type || 'Companion'}</span>
            <button className={`favorite-button ${favorite ? 'is-saved' : ''}`} onClick={() => onFavorite(listing.id)} disabled={busy} aria-label={`${favorite ? 'Remove' : 'Save'} ${listing.pet_name}${favorite ? ' from' : ' to'} favorites`} aria-pressed={favorite}><FiHeart aria-hidden="true" /></button>
        </div>
        <div className="listing-card-body">
            <span className="listing-location"><FiMapPin aria-hidden="true" />{listing.location || 'Location not shared'}</span>
            <h3><Link to={`/listings/${listing.id}`} state={{ browsePath }}>{listing.pet_name}</Link></h3>
            <p>{listing.breed || listing.animal || 'Pet'} <span>·</span> {listing.age || 'Age not shared'}</p>
            <div className="listing-card-actions">
                <Link className="pat-button" to={own ? `/listings/${listing.id}/edit` : `/messages?user=${listing.user_id}`}>{own ? 'Edit listing' : 'Contact'}</Link>
                <Link className="pat-button secondary" to={`/listings/${listing.id}`} state={{ browsePath }}>View details</Link>
            </div>
        </div>
    </article>;
}
