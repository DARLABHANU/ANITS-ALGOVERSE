// server.js (Updated Backend Code with Enhanced Authentication)

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Load environment variables from .env file
dotenv.config();

// For debugging: Check if MONGO_URI and JWT_SECRET are loaded
console.log('Backend DEBUG: MONGO_URI loaded:', !!process.env.MONGO_URI);
console.log('Backend DEBUG: JWT_SECRET loaded:', !!process.env.JWT_SECRET);

const app = express();

// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Backend DEBUG: MongoDB Connected...');
    } catch (err) {
        console.error('Backend ERROR: MongoDB connection error:', err.message);
        process.exit(1);
    }
};

// Connect to database when the server starts
connectDB();

// --- Middleware ---
app.use(express.json({ extended: false }));

// --- CORS Configuration ---
const FRONTEND_URL = 'http://localhost:8080';

const corsOptions = {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
console.log(`Backend DEBUG: CORS enabled for origin: ${FRONTEND_URL}`);

// --- User Model (Schema) ---
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Added trim to remove whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true // Store emails in lowercase
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
    if (!this.isModified('password')) {
        return next();
    }
    console.log('Backend DEBUG: Hashing new/modified password.');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password during login
UserSchema.methods.matchPassword = async function(enteredPassword) {
    console.log('Backend DEBUG: Comparing entered password with stored hash.');
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

// --- Helper Middleware for JWT Verification ---
const authMiddleware = async (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// --- API Routes ---

// @route   GET /
// @desc    Test API endpoint
// @access  Public
app.get('/', (req, res) => {
    console.log('Backend DEBUG: Root route (/) accessed.');
    res.send('API is running...');
});

// @route   GET /api/auth/user
// @desc    Get authenticated user data
// @access  Private
app.get('/api/auth/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Backend ERROR: User route handler error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
app.post(
    '/api/auth/signup',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
    ],
    async (req, res) => {
        console.log('Backend DEBUG: Signup request received:', req.body.email);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Backend DEBUG: Signup validation errors:', errors.array());
            const formattedErrors = errors.array().map(error => ({ msg: error.msg, param: error.param }));
            return res.status(400).json({ errors: formattedErrors });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                console.log('Backend DEBUG: Signup failed - User already exists for email:', email);
                return res.status(400).json({ errors: [{ msg: 'User already exists', param: 'email' }] });
            }

            user = new User({
                name,
                email,
                password
            });

            await user.save();
            console.log('Backend DEBUG: New user saved to DB:', user.email);

            // Create JWT payload with username included
            const payload = {
                user: {
                    id: user.id,
                    name: user.name // Include name in the token payload
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) {
                        console.error('Backend ERROR: JWT sign error for signup:', err.message);
                        throw err;
                    }
                    console.log('Backend DEBUG: JWT generated for signup. Token length:', token.length);
                    // Return token, username, and success message
                    res.status(201).json({ 
                        msg: 'User registered successfully', 
                        token,
                        username: user.name 
                    });
                }
            );

        } catch (err) {
            console.error('Backend ERROR: Signup route handler error:', err.message);
            if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
                return res.status(400).json({ errors: [{ msg: 'User with this email already exists', param: 'email' }] });
            }
            res.status(500).json({ msg: 'Server error' });
        }
    }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (User Sign-in)
// @access  Public
app.post(
    '/api/auth/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        console.log('Backend DEBUG: Login request received:', req.body.email);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Backend DEBUG: Login validation errors:', errors.array());
            const formattedErrors = errors.array().map(error => ({ msg: error.msg, param: error.param }));
            return res.status(400).json({ errors: formattedErrors });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                console.log('Backend DEBUG: Login failed - User not found for email:', email);
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                console.log('Backend DEBUG: Login failed - Password mismatch for email:', email);
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            // Create JWT payload with username included
            const payload = {
                user: {
                    id: user.id,
                    name: user.name // Include name in the token payload
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) {
                        console.error('Backend ERROR: JWT sign error for login:', err.message);
                        throw err;
                    }
                    console.log('Backend DEBUG: JWT generated for login. Token length:', token.length);
                    // Return token, username, and success message
                    res.json({ 
                        msg: 'Login successful', 
                        token,
                        username: user.name 
                    });
                }
            );

        } catch (err) {
            console.error('Backend ERROR: Login route handler error:', err.message);
            res.status(500).json({ msg: 'Server error' });
        }
    }
);

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token invalidation)
// @access  Private
app.post('/api/auth/logout', authMiddleware, (req, res) => {
    // Note: JWT tokens are stateless, so actual invalidation must be handled client-side
    res.json({ msg: 'Logout successful. Please remove the token on the client side.' });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error('Backend GLOBAL ERROR HANDLER:', err.stack);
    res.status(500).json({ msg: 'Something went wrong on the server.' });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Backend DEBUG: Server started on port ${PORT}`));