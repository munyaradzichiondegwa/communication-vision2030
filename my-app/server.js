const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

// MongoDB Models
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['citizen', 'investor', 'admin'], 
        default: 'citizen' 
    },
    kpis: {
        projectsInvolved: { type: Number, default: 0 },
        contributionScore: { type: Number, default: 0 }
    }
});

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    sector: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['planning', 'in-progress', 'completed'], 
        default: 'planning' 
    },
    budget: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const KPISchema = new mongoose.Schema({
    name: { type: String, required: true },
    currentValue: { type: Number, required: true },
    targetValue: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);
const KPI = mongoose.model('KPI', KPISchema);

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Refresh Token Endpoint
app.post('/api/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);

    // In a real-world scenario, you'd check against stored refresh tokens
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        
        const accessToken = generateAccessToken({ id: user.id });
        res.json({ accessToken });
    });
});

// Authentication Endpoints
app.post('/api/auth/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(
            { id: user._id }, 
            process.env.REFRESH_TOKEN_SECRET
        );

        res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(
            { id: user._id }, 
            process.env.REFRESH_TOKEN_SECRET
        );

        res.json({ 
            accessToken, 
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// KPI Endpoints
app.get('/api/kpis', authenticateToken, async (req, res) => {
    try {
        const kpis = await KPI.find();
        res.json(kpis);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching KPIs', 
            error: error.message 
        });
    }
});

// Project Endpoints
app.get('/api/projects', authenticateToken, async (req, res) => {
    try {
        const { sector, status } = req.query;
        let query = {};
        
        if (sector) query.sector = sector;
        if (status) query.status = status;

        const projects = await Project.find(query)
            .populate('contributors', 'name email');
        
        res.json(projects);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching projects', 
            error: error.message 
        });
    }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
    try {
        const project = new Project({
            ...req.body,
            contributors: [req.user.id]
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating project', 
            error: error.message 
        });
    }
});

// Utility Functions
function generateAccessToken(user) {
    return jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '15m' }
    );
}

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' 
            ? {} 
            : err.message
    });
});

// Connect to MongoDB and Start Server
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
        console.log('Server running on port 5000');
    });
})
.catch(error => {
    console.error('MongoDB Connection Error', error);
});