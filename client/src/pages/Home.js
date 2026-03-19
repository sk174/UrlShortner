import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-content">
          <div className="hero-badge">⚡ Free URL Shortener</div>
          <h1 className="hero-title">
            Make long links<br />
            <span className="hero-highlight">disappear.</span>
          </h1>
          <p className="hero-sub">
            Shorten any URL in seconds. Get custom codes, QR codes,<br />
            and click tracking — all in one clean dashboard.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn-hero-primary">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/register" className="btn-hero-primary">Start for free →</Link>
                <Link to="/login" className="btn-hero-ghost">Login</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="url-demo-card">
            <div className="demo-label">Before</div>
            <div className="demo-url long">https://www.example.com/very/long/url/that/nobody/wants/to-share/anymore?utm_source=email</div>
            <div className="demo-arrow">↓</div>
            <div className="demo-label">After</div>
            <div className="demo-url short">snip.ly/<span style={{color:'#6c63ff'}}>xyz123</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>Custom Short Codes</h3>
            <p>Choose your own memorable alias instead of a random code.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>QR Code Generation</h3>
            <p>Every short URL gets an instant downloadable QR code.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Click Tracking</h3>
            <p>See how many times your short URL has been visited.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>10 URLs / Day</h3>
            <p>Create up to 10 shortened URLs per day, resets at midnight.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
