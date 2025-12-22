const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Custom log format for detailed logging
const logFormat = ':date[iso] :method :url :status :response-time ms - :res[content-length] - :remote-addr - :user-agent';

// Request logging - shows in console and Render logs
app.use(morgan(logFormat));

// Also log to console with timestamp for important events
const log = (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
};

// CORS Configuration
const corsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// DB Config
const db = process.env.MONGO_URI || 'mongodb://localhost:27017/nex';

// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => log('MongoDB Connected'))
    .catch(err => log('MongoDB Error: ' + err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/packages', require('./routes/packages'));

// Clean URL routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/publish', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'publish.html'));
});

// Redirect /packages to frontend
app.get('/packages', (req, res) => {
    res.redirect('https://try-nex.vercel.app/packages');
});

app.get('/packages/*', (req, res) => {
    res.redirect('https://try-nex.vercel.app' + req.path);
});

// 404 handler
app.use((req, res) => {
    log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ msg: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    log(`Error: ${err.message}`);
    console.error(err.stack);
    res.status(500).json({ msg: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    log(`Server started on port ${PORT}`);
    log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
