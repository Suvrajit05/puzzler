const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const app = express();

// Import routes
const homeRoutes = require('./routes/home');
const adminRoutes = require('./routes/admin');
const gameRoutes = require('./routes/games');

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds
    connectTimeoutMS: 30000,
    bufferCommands: false,
    bufferMaxEntries: 0
}).then(() => {
    console.log('Connected to MongoDB Atlas successfully');
}).catch(err => {
    console.error('Database connection error:', err);
    console.error('MongoDB URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Routes
app.use('/', homeRoutes);
app.use('/admin', adminRoutes);
app.use('/games', gameRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Error',
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { 
        title: '404 - Page Not Found',
        message: 'The page you are looking for does not exist.'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`MongoDB URI configured: ${process.env.MONGODB_URI ? 'Yes' : 'No'}`);
});
