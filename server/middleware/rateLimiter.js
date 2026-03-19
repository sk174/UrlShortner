const Url = require('../models/Url');

const dailyLimitMiddleware = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get start of today (midnight)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Count URLs created today by this user
    const todayCount = await Url.countDocuments({
      userId,
      createdAt: { $gte: startOfDay }
    });

    if (todayCount >= 10) {
      return res.status(429).json({
        message: 'Daily limit reached. You can create up to 10 shortened URLs per day.',
        limit: 10,
        used: todayCount,
        remaining: 0,
        resetsAt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
      });
    }

    // Attach usage info to request
    req.dailyUsage = { used: todayCount, remaining: 10 - todayCount };
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error checking rate limit' });
  }
};

module.exports = { dailyLimitMiddleware };
