const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Import your User model

const authenticateUser = async (req, res, next) => {
  // Extract token from the "Authorization" header
  const token = req.headers['authorization']?.split(' ')[1]; // Get the token after 'Bearer'

  // Check if token is present
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing or malformed' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Look up the user in the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Attach the user to the request object
    req.user = user;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;
