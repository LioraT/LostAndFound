const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
const token = req.header('Authorization');
if (!token) { 
    console.log("no Authorization token");
    return res.status(401).json({ error: 'Access is denied' });
}
try {
 console.log("checking token", token);
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
 };

module.exports = verifyToken;