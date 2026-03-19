import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-text">snip<span className="brand-accent">.ly</span></span>
      </Link>
      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-nav-cta">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
