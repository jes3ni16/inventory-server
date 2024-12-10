
const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logoutUser } = require('../controllers/user.controller');


const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      return next(); // Continue to the next middleware/route
    }
    return res.status(401).json({ error: 'Unauthorized' });
  };

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/protected', isAuthenticated, (req, res) => {
    res.status(200).json({ message: `Welcome ${req.session.user.username}` });
  });

module.exports = router;
