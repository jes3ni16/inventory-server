const jwt = require('jsonwebtoken');
const User = require('../models/user.model');  // Ensure the correct path to your User model

const authenticateUser = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = user;  // Attach the user to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;
