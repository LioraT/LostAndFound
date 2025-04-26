const jwt = require('jsonwebtoken');
const debug = require('../utils/debug');
const { hebrewUrl } = require('../utils/hebrewUtils');
const verifyToken = () => {
    // Only captured once at route-definition time
    const stack = new Error().stack?.split('\n') || [];
  
    const callerLine = stack.find(line =>
      !line.includes('node_modules') &&
      !line.includes(__filename) &&
      line.includes('.js')
    );
    let definedAt = 'unknown';
    if (callerLine) {
        definedAt = callerLine.trim()
          .replace(/^at\s+/, '')                     // remove "at"
          .replace(/^Object\.<anonymous>\s+\(/, '')  // remove "Object.<anonymous> ("
          .replace(/\)$/, '');                       // remove trailing ")"
    }

    // debug.log ("verifyToken registred from: ", definedAt);
    return (req, res, next) => {
        if (process.env.DEBUG_MODE === 'true') {
	        const origUrl = hebrewUrl(req.originalUrl);
            debug.log(`🔐 [${req.method} ${origUrl}] route defined at ${definedAt}`);
        }
        const token = req.header('Authorization');
        if (!token) { 
            console.log("no Authorization token");
            return res.status(401).json({ error: 'Access is denied' });
        }
        try {
            const secretKey = process.env.JWT_SECRET;
            if (!secretKey) {
               throw new Error("JWT secret is missing from environment variables");
            }
            const decoded = jwt.verify(token, secretKey);
            req.userId = decoded.userId;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }       
    } 
};
module.exports = verifyToken;
