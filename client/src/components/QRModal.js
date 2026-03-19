import './QRModal.css';

const QRModal = ({ url, onClose }) => {
  if (!url) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `qr-${url.shortCode}.png`;
    link.href = url.qrCode;
    link.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 className="modal-title">QR Code</h3>
        <p className="modal-subtitle">{url.shortUrl}</p>
        <div className="qr-wrapper">
          <img src={url.qrCode} alt="QR Code" className="qr-image" />
        </div>
        <div className="modal-actions">
          <button className="btn-download" onClick={handleDownload}>
            ↓ Download PNG
          </button>
        </div>
        <p className="modal-original">→ {url.originalUrl.length > 50 ? url.originalUrl.slice(0, 50) + '...' : url.originalUrl}</p>
      </div>
    </div>
  );
};

export default QRModal;
