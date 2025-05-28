// middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied. No token provided.');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access Denied. You do not have the required permissions.');
  }
  next();
};

module.exports = { verifyToken, isAdmin };
