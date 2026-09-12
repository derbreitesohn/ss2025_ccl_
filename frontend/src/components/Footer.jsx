import { Link } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import logo from '../images/logo_patpat.png';

export default function Footer() {
    return <footer className="site-footer"><div className="page-shell footer-inner">
        <Link to="/" aria-label="PatPat home"><img src={logo} alt="PatPat" /></Link>
        <p>A little connection. A lot of love. <FaPaw aria-hidden="true" /></p>
        <div><Link to="/#browse">Find a companion</Link><Link to="/#how-it-works">How it works</Link></div>
    </div></footer>;
}
