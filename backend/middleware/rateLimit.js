const rateLimit = require("express-rate-limit");

// limit number of connexions per hour to 10
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10
});

module.exports = limiter;
