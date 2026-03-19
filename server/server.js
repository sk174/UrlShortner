require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { redirectUrl } = require('./controllers/urlController');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/url', require('./routes/urlRoutes'));

// Redirect short URLs (must be AFTER api routes)
app.get('/:shortCode', redirectUrl);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🔗 TinyURL Clone API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
