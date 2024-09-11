require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const logger = require('./utils/logger'); // Import Winston logger

// Initialize Express
const app = express();

// Load environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { serverApi: { version: '1', strict: false, deprecationErrors: true } })
    .then(() => console.log('💥 Connected to the database.'))
    .catch(err =>
    {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Apply middlewares
app.use(cors()); // Enable CORS for cross-origin requests
app.use(helmet()); // Set various security headers
app.use(xssClean()); // Prevent XSS attacks
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev')); // Logging

// Apply rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Serve static files (for file uploads or static assets)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.get('/', (req, res) =>
{
    res.send('API is running...');
});

// Import and use routers (assuming they are in a routes folder)
const userRoutes = require('./routes/userRoutes');

// API Routes
app.use('/api/users', userRoutes);

// Error handling for 404 (Not Found)
app.use(notFound);

// General Error Handling
app.use((err, req, res, next) =>
{
    logger.error(err.stack); // Log errors to file
    errorHandler(err, req, res, next);
});

// Start the server
app.listen(PORT, () =>
{
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});
