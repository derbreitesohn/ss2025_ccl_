import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import fee from '../images/fee_ccl.png';
import './LoginPage.css';

export default function AuthLayout({ children }) {
    return <><Navbar /><main className="auth-layout">
        <div className="auth-form-section"><div className="auth-form-content">
            <Link className="auth-back" to="/#browse">Back to exploring</Link>
            {children}
        </div></div>
        <aside className="auth-photo"><img src={fee} alt="Fee, a friendly black Labrador" /></aside>
    </main></>;
}
