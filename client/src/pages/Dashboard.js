import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { shortenUrl, getMyUrls, deleteUrl } from '../api';
import UrlCard from '../components/UrlCard';
import QRModal from '../components/QRModal';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [dailyUsage, setDailyUsage] = useState({ used: 0, remaining: 10, limit: 10 });
  const [form, setForm] = useState({ originalUrl: '', customCode: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);

  const fetchUrls = useCallback(async () => {
    try {
      const { data } = await getMyUrls();
      setUrls(data.urls);
      setDailyUsage(data.dailyUsage);
    } catch (err) {
      setError('Failed to load URLs');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { fetchUrls(); }, [fetchUrls]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);
    try {
      const payload = { originalUrl: form.originalUrl };
      if (form.customCode.trim()) payload.customCode = form.customCode.trim();

      const { data } = await shortenUrl(payload);
      setUrls(prev => [data, ...prev]);
      if (data.dailyUsage) setDailyUsage(data.dailyUsage);
      setSuccess(data);
      setForm({ originalUrl: '', customCode: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this URL?')) return;
    try {
      await deleteUrl(id);
      setUrls(prev => prev.filter(u => u._id !== id));
      setDailyUsage(prev => ({ ...prev, used: prev.used - 0 })); // re-fetch for accuracy
      fetchUrls();
    } catch {
      setError('Failed to delete URL');
    }
  };

  const limitPercent = (dailyUsage.used / dailyUsage.limit) * 100;
  const limitColor = limitPercent >= 90 ? 'var(--danger)' : limitPercent >= 60 ? '#ffa502' : 'var(--accent3)';

  return (
    <div className="dashboard page-enter">
      <div className="dash-container">

        {/* Header */}
        <div className="dash-header">
          <div>
            <h2>Dashboard</h2>
            <p className="dash-greeting">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
          </div>
          <div className="usage-widget">
            <div className="usage-label">
              <span>Today's URLs</span>
              <span style={{ color: limitColor }}>{dailyUsage.used} / {dailyUsage.limit}</span>
            </div>
            <div className="usage-bar-bg">
              <div
                className="usage-bar-fill"
                style={{ width: `${limitPercent}%`, background: limitColor }}
              />
            </div>
            <p className="usage-sub">{dailyUsage.remaining} remaining · resets at midnight</p>
          </div>
        </div>

        {/* Shorten Form */}
        <div className="shorten-card">
          <h3>Shorten a URL</h3>
          {error && <div className="form-error">{error}</div>}
          {success && (
            <div className="form-success">
              <span>✓ Created!</span>
              <a href={success.shortUrl} target="_blank" rel="noreferrer">{success.shortUrl}</a>
              <button onClick={() => { navigator.clipboard.writeText(success.shortUrl); }}>Copy</button>
            </div>
          )}
          <form onSubmit={handleShorten} className="shorten-form">
            <div className="shorten-inputs">
              <div className="field">
                <label>Long URL *</label>
                <input
                  type="url"
                  name="originalUrl"
                  placeholder="https://example.com/very/long/url"
                  value={form.originalUrl}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Custom Code <span className="optional">(optional)</span></label>
                <div className="custom-input-wrap">
                  <span className="custom-prefix">snip.ly/</span>
                  <input
                    type="text"
                    name="customCode"
                    placeholder="my-link"
                    value={form.customCode}
                    onChange={handleChange}
                    maxLength={20}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn-shorten"
              disabled={loading || dailyUsage.remaining <= 0}
            >
              {loading ? 'Shortening...' :
               dailyUsage.remaining <= 0 ? '🚫 Daily limit reached' :
               '⚡ Shorten URL'}
            </button>
          </form>
        </div>

        {/* URL List */}
        <div className="url-list-section">
          <div className="url-list-header">
            <h3>Your URLs <span className="url-count">{urls.length}</span></h3>
          </div>

          {fetching ? (
            <div className="loading-state">Loading your URLs...</div>
          ) : urls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔗</div>
              <p>No URLs yet. Shorten your first link above!</p>
            </div>
          ) : (
            <div className="url-grid">
              {urls.map(url => (
                <UrlCard
                  key={url._id}
                  url={url}
                  onDelete={handleDelete}
                  onQRClick={setQrUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Modal */}
      <QRModal url={qrUrl} onClose={() => setQrUrl(null)} />
    </div>
  );
};

export default Dashboard;
