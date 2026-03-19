const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const QRCode = require('qrcode');
const Url = require('../models/Url');

// @desc   Shorten a URL
// @route  POST /api/url/shorten
const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customCode } = req.body;

    // Validate URL
    if (!validUrl.isUri(originalUrl)) {
      return res.status(400).json({ message: 'Invalid URL. Please include http:// or https://' });
    }

    let shortCode;

    if (customCode) {
      // Validate custom code format
      const codeRegex = /^[a-zA-Z0-9_-]{3,20}$/;
      if (!codeRegex.test(customCode)) {
        return res.status(400).json({
          message: 'Custom code must be 3-20 characters (letters, numbers, - or _ only)'
        });
      }

      // Check if custom code is already taken
      const existing = await Url.findOne({ shortCode: customCode });
      if (existing) {
        return res.status(400).json({ message: 'This custom code is already taken. Try another.' });
      }

      shortCode = customCode;
    } else {
      // Generate unique short code
      let isUnique = false;
      while (!isUnique) {
        shortCode = nanoid(6);
        const exists = await Url.findOne({ shortCode });
        if (!exists) isUnique = true;
      }
    }

    // Generate QR code as base64
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    const qrCode = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });

    // Save to DB
    const url = await Url.create({
      originalUrl,
      shortCode,
      customCode: !!customCode,
      userId: req.user._id,
      qrCode
    });

    res.status(201).json({
      _id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl,
      qrCode: url.qrCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
      dailyUsage: req.dailyUsage
        ? { used: req.dailyUsage.used + 1, remaining: req.dailyUsage.remaining - 1 }
        : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Redirect to original URL
// @route  GET /:shortCode
const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode, isActive: true });

    if (!url) {
      return res.status(404).json({ message: 'Short URL not found or has been deactivated' });
    }

    // Increment click count
    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all URLs for logged-in user
// @route  GET /api/url/my-urls
const getMyUrls = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Calculate today's usage
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayCount = await Url.countDocuments({
      userId: req.user._id,
      createdAt: { $gte: startOfDay }
    });

    const baseUrl = process.env.BASE_URL;
    const urlsWithShortUrl = urls.map(u => ({
      _id: u._id,
      originalUrl: u.originalUrl,
      shortCode: u.shortCode,
      shortUrl: `${baseUrl}/${u.shortCode}`,
      customCode: u.customCode,
      clicks: u.clicks,
      qrCode: u.qrCode,
      isActive: u.isActive,
      createdAt: u.createdAt
    }));

    res.json({
      urls: urlsWithShortUrl,
      dailyUsage: { used: todayCount, remaining: 10 - todayCount, limit: 10 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete a URL
// @route  DELETE /api/url/:id
const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) return res.status(404).json({ message: 'URL not found' });

    // Only owner can delete
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this URL' });
    }

    await url.deleteOne();
    res.json({ message: 'URL deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { shortenUrl, redirectUrl, getMyUrls, deleteUrl };
