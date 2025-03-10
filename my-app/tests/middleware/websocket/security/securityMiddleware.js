// security/securityMiddleware.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later'
});

// Advanced Security Middleware
function setupSecurityMiddleware(app) {
    // Helmet for setting various HTTP headers
    app.use(helmet());

    // Rate limiting
    app.use('/api/', apiLimiter);

    // Prevent NoSQL injection
    app.use(mongoSanitize());

    // Prevent XSS attacks
    app.use(xss());

    // Additional custom security headers
    app.use((req, res, next) => {
        // Custom security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        next();
    });

    // Advanced input validation
    app.use((req, res, next) => {
        // Validate and sanitize all input
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
        next();
    });
}

// Advanced Password Complexity Checker
function validatePasswordComplexity(password) {
    const complexityRegex = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
    );

    return {
        isValid: complexityRegex.test(password),
        requirements: [
            'At least 8 characters long',
            'Contains at least one uppercase letter',
            'Contains at least one lowercase letter',
            'Contains at least one number',
            'Contains at least one special character'
        ]
    };
}

module.exports = {
    setupSecurityMiddleware,
    validatePasswordComplexity
};