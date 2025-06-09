import Bottleneck from "bottleneck";
import userAgent from "express-useragent";

// ✅ Create a rate limiter using the Token Bucket algorithm
const limiter = new Bottleneck({
    maxConcurrent: 1, // Only 1 request can be processed at a time
    reservoir: 100, // Max 100 tokens (requests allowed)
    reservoirRefreshAmount: 100, // Refills 100 tokens
    reservoirRefreshInterval: 15 * 60 * 1000, // Every 15 minutes
});

// ✅ Middleware for rate limiting
const rateLimiter = async (req, res, next) => {
    try {
        await limiter.schedule(() => Promise.resolve());
        next();
    } catch (error) {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later.",
        });
    }
};

// ✅ Middleware for bot protection
const botProtection = (req, res, next) => {
    const userAgentHeader = req.headers["user-agent"];

    // Block requests with no user-agent (likely a bot)
    if (!userAgentHeader) {
        return res.status(403).json({ success: false, message: "Access forbidden: No user-agent detected." });
    }

    // Detect and block bad bots (Modify the list as needed)
    const blockedBots = ["curl", "wget", "bot", "spider", "crawler"];
    if (blockedBots.some((bot) => userAgentHeader.toLowerCase().includes(bot))) {
        return res.status(403).json({ success: false, message: "Access forbidden: Bot detected." });
    }

    next();
};

// ✅ IP Blocking Middleware
const forbiddenIPs = ["192.168.1.100", "203.0.113.5"]; // Add IPs to block
const ipBlocker = (req, res, next) => {
    const userIP = req.ip || req.connection.remoteAddress;
    
    if (forbiddenIPs.includes(userIP)) {
        return res.status(403).json({ success: false, message: "Access forbidden: Your IP is blocked." });
    }

    next();
};

// ✅ Export Middleware
const securityMiddleware = [rateLimiter, userAgent.express(), botProtection, ipBlocker];
export default securityMiddleware;
