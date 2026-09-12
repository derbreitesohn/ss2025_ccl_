import { useState } from 'react';
import { FaPaw } from 'react-icons/fa';

export default function PetPhoto({ src, name, className = '', eager = false }) {
    const [failedSrc, setFailedSrc] = useState(null);
    if (!src || failedSrc === src) return <div className={`pet-photo-placeholder ${className}`} role="img" aria-label={`Photo not available for ${name}`}><FaPaw aria-hidden="true" /><span>Photo coming soon</span></div>;
    return <img className={className} src={src} alt={name} loading={eager ? 'eager' : 'lazy'} onError={() => setFailedSrc(src)} />;
}
