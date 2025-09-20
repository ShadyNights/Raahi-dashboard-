// server.js - Express.js server for Rahi Travel App
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://unpkg.com", "https://generativelanguage.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "https://maps.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://maps.googleapis.com"]
    }
  }
}));

app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '.'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0'
}));

// API Routes for Gemini AI
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const fetch = (await import('node-fetch')).default;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ 
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY in .env file' 
      });
    }

    const requestBody = {
      contents: [{
        parts: [{
          text: `You are a helpful travel assistant for the Rahi app in India. Keep responses under 150 words and helpful for travelers. Focus on Indian tourism, safety, and local insights. User message: ${message}`
        }]
      }]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    let aiText = null;
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      aiText = data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Could not extract text from API response');
    }
    
    res.json({ response: aiText });
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: `AI service unavailable: ${error.message}` 
    });
  }
});

// API endpoint for notifications
app.get('/api/notifications', (req, res) => {
  const notifications = [
    {
      id: 1,
      title: "Safety Alert",
      message: "High tourist activity detected in your area. Stay vigilant.",
      time: "2 mins ago",
      type: "warning"
    },
    {
      id: 2,
      title: "Weather Update", 
      message: "Light rain expected this evening. Plan accordingly.",
      time: "1 hour ago",
      type: "info"
    },
    {
      id: 3,
      title: "Community",
      message: "3 Rahi users are nearby and available for assistance.",
      time: "3 hours ago", 
      type: "success"
    }
  ];
  
  res.json(notifications);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve the main app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle React Router (if needed later)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Rahi Travel App server running on port ${PORT}`);
  console.log(`🌐 Open your browser to: http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.warn('⚠️  Warning: Gemini API key not configured. AI chat will not work.');
  }
  
  if (!process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY === 'AIzaSyCrpu2LQkHr5byIdZQiBlUpKvXZ-f6qBw') {
    console.warn('⚠️  Warning: Google Maps API key not configured. Maps may not work.');
  }
});

module.exports = app;
