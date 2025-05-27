// server.js (Consolidated Backend Code)

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

// Load environment variables
dotenv.config();

const app = express();

// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};

// Connect to database
connectDB();

// --- Middleware ---
app.use(express.json({ extended: false })); // Allows us to get data in req.body
app.use(cors()); // Enable CORS for all routes (important for frontend communication)

// --- User Model (Schema) ---
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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

// Hash password before saving the user
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password (not directly used in signup, but good for login)
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

// --- API Routes ---

// @route   GET /
// @desc    Test API endpoint
// @access  Public
app.get('/', (req, res) => {
    res.send('API is running...');
});

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
app.post(
    '/api/auth/signup', // Changed route prefix to /api/auth/signup directly
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'Please enter a password with 8 or more characters'
        ).isLength({ min: 8 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Map validation errors to a more frontend-friendly format
            const formattedErrors = errors.array().map(error => ({ msg: error.msg, param: error.param }));
            return res.status(400).json({ errors: formattedErrors });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists', param: 'email' }] });
            }

            user = new User({
                name,
                email,
                password
            });

            await user.save();

            // In a real app, you'd likely generate a JWT here and send it back
            res.status(201).json({ msg: 'User registered successfully' });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// --- Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));