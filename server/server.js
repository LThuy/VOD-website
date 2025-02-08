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

// Middleware
app.use(bodyParser.json());
const allowedOrigins = [
  process.env.CLIENT_BASE_URL,
  process.env.CLIENT_DASHBOARD_URL
].filter(Boolean);


app.use(cors({
  origin: (origin, callback) => {
      if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
          callback(null, true);
      } else {
          console.error('Blocked by CORS:', origin);
          callback(new Error('Not allowed by CORS'));
      }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow cookies and auth headers
}));

// Handle preflight requests (OPTIONS)
app.options('*', cors());

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

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
