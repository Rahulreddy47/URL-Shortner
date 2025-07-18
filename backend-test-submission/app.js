const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const urlRoutes = require('./routes/urlRoutes');
const customLogger = require('../logging-middleware/logger');

dotenv.config();

const app = express();

// ✅ Proper CORS setup
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Optional but safe
app.options('*', cors());

// ✅ Middleware
app.use(express.json());
app.use(customLogger);

// ✅ Routes
app.use('/', urlRoutes);

// ✅ Start server

module.exports = app;
