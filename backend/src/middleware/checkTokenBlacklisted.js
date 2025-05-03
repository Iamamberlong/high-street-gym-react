// A simple in-memory blacklist for demonstration
const blacklist = new Set(); 

export function checkTokenBlacklisted(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (blacklist.has(token)) {
    return res.status(401).json({ message: 'Token is blacklisted' });
  }
  next();
}

export { blacklist }; // Export the blacklist if needed elsewhere
