const express = require('express');
const router = express.Router();
const { shortenUrl, getMyUrls, deleteUrl } = require('../controllers/urlController');
const { protect } = require('../middleware/authMiddleware');
const { dailyLimitMiddleware } = require('../middleware/rateLimiter');

router.post('/shorten', protect, dailyLimitMiddleware, shortenUrl);
router.get('/my-urls', protect, getMyUrls);
router.delete('/:id', protect, deleteUrl);

module.exports = router;
