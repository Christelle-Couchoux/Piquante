const rateLimit = require("express-rate-limit");

// limit number of requests per hour to 5
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5
});

module.exports = limiter;
