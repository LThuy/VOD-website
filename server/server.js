// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const route = require('./routes/index');
const app = express();
const path = require('path');
const port = 5000;
require('dotenv').config();

// Middleware - Fix duplicate bodyParser declarations
app.use(express.json({ limit: '2gb' }));
app.use(express.urlencoded({ limit: '2gb', extended: true }));

// If you're using body-parser
app.use(bodyParser.json({ limit: '2gb' }));
app.use(bodyParser.urlencoded({ limit: '2gb', extended: true }));



const allowedOrigins = [
  process.env.CLIENT_BASE_URL,
  process.env.CLIENT_DASHBOARD_URL,
  process.env.REACT_APP_SERVER_BASE_URL
].filter(Boolean); 

// CORS configuration looks good, but let's add more headers
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "Content-Length", 
    "X-Requested-With", 
    "Accept"
  ],
  credentials: true,
  maxAge: 86400 // Cache preflight request for 24 hours
}));

// Handle preflight requests
app.options('*', cors());

// Add error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 413) {
    res.status(413).json({ 
      error: 'Request entity too large',
      details: err.message 
    });
  } else {
    next();
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
route(app);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    details: err.message 
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});