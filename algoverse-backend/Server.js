// server.js (Consolidated Backend Code with Signup and Login)

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken'); // Needed for generating tokens on login/signup

// Load environment variables from .env file
dotenv.config();

// For debugging: Check if MONGO_URI and JWT_SECRET are loaded
console.log('Backend DEBUG: MONGO_URI loaded:', !!process.env.MONGO_URI); // Check if it exists, don't print full URI
console.log('Backend DEBUG: JWT_SECRET loaded:', !!process.env.JWT_SECRET); // Check if it exists

const app = express();

// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Backend DEBUG: MongoDB Connected...');
    } catch (err) {
        console.error('Backend ERROR: MongoDB connection error:', err.message);
        process.exit(1); // Exit process with failure
    }
};

// Connect to database when the server starts
connectDB();

// --- Middleware ---
// Body parser: Allows us to get data in req.body
app.use(express.json({ extended: false }));

// --- CORS Configuration ---
// IMPORTANT: Set this to the exact URL where your Vite frontend is running.
// Based on your Vite output, it's http://localhost:8080
const FRONTEND_URL = 'http://localhost:8080';

const corsOptions = {
    origin: FRONTEND_URL, // Only allow requests from your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow necessary HTTP methods
    credentials: true, // Allow cookies/authorization headers to be sent with requests
    optionsSuccessStatus: 204 // For preflight requests
};
app.use(cors(corsOptions));
console.log(`Backend DEBUG: CORS enabled for origin: ${FRONTEND_URL}`);

// --- User Model (Schema) ---
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures email addresses are unique in the database
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to hash password before saving a new user
UserSchema.pre('save', async function(next) {
    // console.log('Backend DEBUG: Pre-save hook - checking password modification.');
    if (!this.isModified('password')) { // Only hash if password was modified (or is new)
        return next(); // Use return to exit early
    }
    console.log('Backend DEBUG: Hashing new/modified password.');
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
    next();
});

// Method to compare entered password with hashed password during login
UserSchema.methods.matchPassword = async function(enteredPassword) {
    console.log('Backend DEBUG: Comparing entered password with stored hash.');
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

// --- API Routes ---

// @route   GET /
// @desc    Test API endpoint
// @access  Public
app.get('/', (req, res) => {
    console.log('Backend DEBUG: Root route (/) accessed.');
    res.send('API is running...');
});

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
app.post(
    '/api/auth/signup',
    [
        // Input validation using express-validator
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'Please enter a password with 8 or more characters'
        ).isLength({ min: 8 })
    ],
    async (req, res) => {
        console.log('Backend DEBUG: Signup request received:', req.body.email); // Log email for easy tracking
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Backend DEBUG: Signup validation errors:', errors.array());
            // Return validation errors if any
            const formattedErrors = errors.array().map(error => ({ msg: error.msg, param: error.param }));
            return res.status(400).json({ errors: formattedErrors });
        }

        const { name, email, password } = req.body;

        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                console.log('Backend DEBUG: Signup failed - User already exists for email:', email);
                return res.status(400).json({ errors: [{ msg: 'User already exists', param: 'email' }] });
            }

            // Create new user instance
            user = new User({
                name,
                email,
                password // Password will be hashed by the pre-save hook
            });

            // Save user to database
            await user.save();
            console.log('Backend DEBUG: New user saved to DB:', user.email);

            // Create and return JSON Web Token (JWT)
            const payload = {
                user: {
                    id: user.id // MongoDB's automatically generated _id for the user
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET, // Secret key from .env
                { expiresIn: '1h' }, // Token expiration time (e.g., 1 hour)
                (err, token) => {
                    if (err) {
                        console.error('Backend ERROR: JWT sign error for signup:', err.message);
                        throw err; // Propagate error to outer catch
                    }
                    console.log('Backend DEBUG: JWT generated for signup. Token length:', token.length);
                    // Send success message and the token
                    res.status(201).json({ msg: 'User registered successfully', token });
                }
            );

        } catch (err) {
            console.error('Backend ERROR: Signup route handler error:', err.message);
            // Check for Mongoose duplicate key error (code 11000) for better error message
            if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
                return res.status(400).json({ errors: [{ msg: 'User with this email already exists', param: 'email' }] });
            }
            res.status(500).json({ msg: 'Server error' }); // Send JSON error
        }
    }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (User Sign-in)
// @access  Public
app.post(
    '/api/auth/login',
    [
        // Input validation for login
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        console.log('Backend DEBUG: Login request received:', req.body.email);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Backend DEBUG: Login validation errors:', errors.array());
            // Return validation errors
            const formattedErrors = errors.array().map(error => ({ msg: error.msg, param: error.param }));
            return res.status(400).json({ errors: formattedErrors });
        }

        const { email, password } = req.body;

        try {
            // Check if user exists by email
            let user = await User.findOne({ email });
            if (!user) {
                console.log('Backend DEBUG: Login failed - User not found for email:', email);
                // Return generic "Invalid Credentials" for security
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            // Compare provided password with hashed password
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                console.log('Backend DEBUG: Login failed - Password mismatch for email:', email);
                // Return generic "Invalid Credentials"
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            // User is authenticated, create and return JWT
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) {
                        console.error('Backend ERROR: JWT sign error for login:', err.message);
                        throw err; // Propagate error to outer catch
                    }
                    console.log('Backend DEBUG: JWT generated for login. Token length:', token.length);
                    // Send the token back to the client
                    res.json({ msg: 'Login successful', token }); // Added msg field for consistency with signup response
                }
            );

        } catch (err) {
            console.error('Backend ERROR: Login route handler error:', err.message);
            res.status(500).json({ msg: 'Server error' }); // Send JSON error
        }
    }
);

// --- Global Error Handler (Optional but Recommended) ---
app.use((err, req, res, next) => {
    console.error('Backend GLOBAL ERROR HANDLER:', err.stack);
    res.status(500).json({ msg: 'Something went wrong on the server.' });
});


// --- Start Server ---
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

app.listen(PORT, () => console.log(`Backend DEBUG: Server started on port ${PORT}`));