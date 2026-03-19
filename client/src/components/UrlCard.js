import { useState } from 'react';
import './UrlCard.css';

const UrlCard = ({ url, onDelete, onQRClick }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const truncate = (str, n) => str.length > n ? str.slice(0, n) + '...' : str;

  return (
    <div className="url-card">
      <div className="url-card-top">
        <div className="url-info">
          <div className="short-url-row">
            <a href={url.shortUrl} target="_blank" rel="noreferrer" className="short-url">
              {url.shortUrl.replace('http://localhost:5000/', '')}
            </a>
            {url.customCode && <span className="badge-custom">custom</span>}
          </div>
          <p className="original-url" title={url.originalUrl}>
            {truncate(url.originalUrl, 60)}
          </p>
        </div>
        <div className="url-meta">
          <span className="clicks-badge">
            <span className="clicks-num">{url.clicks}</span>
            <span className="clicks-label">clicks</span>
          </span>
        </div>
      </div>

      <div className="url-card-bottom">
        <span className="url-date">{formatDate(url.createdAt)}</span>
        <div className="url-actions">
          <button className={`btn-copy ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? '✓ Copied' : '⧉ Copy'}
          </button>
          <button className="btn-qr" onClick={() => onQRClick(url)}>
            ⊞ QR
          </button>
          <button className="btn-del" onClick={() => onDelete(url._id)}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrlCard;
