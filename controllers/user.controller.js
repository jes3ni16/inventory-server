// controllers/authController.js

const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // 1. Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // 2. Compare the password with the hashed password stored in DB
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // 3. Create a JWT token after successful authentication
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET, // Ensure this is set in your environment variables
        { expiresIn: '8h' } // Optional: set token expiration
      );

      // 4. Send the token to the client
      res.json({ token });

    } catch (error) {
      console.error('Login error:', error); // Log error for debugging
      res.status(500).json({ error: 'Server error, please try again later.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' }); // Handle other HTTP methods
  }
};

module.exports = { registerUser, loginUser };
