require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const User = require('./models/User'); // Import the User model

const app = express();
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// --- Middleware ---
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS for all routes (adjust for production)

// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  });

// --- Routes ---

// @desc    Register a new user
// @route   POST /api/signup
// @access  Public
app.post('/api/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Basic server-side validation (more robust validation should be used)
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user (password hashing is done in User.js pre-save middleware)
    const newUser = await User.create({
      name,
      email,
      password,
    });

    // Send a success response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error('Signup error:', error);
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    // Generic server error
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Basic test route
app.get('/', (req, res) => {
  res.send('AlgoVerse Backend API is running!');
});

// --- Start the server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});