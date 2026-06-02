const express = require('express');
const router = express.Router();
const { register, login, me, updateProfile, changePassword } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, me);

// @route   PUT api/auth/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   PUT api/auth/password
// @desc    Change current user password
// @access  Private
router.put('/password', auth, changePassword);

module.exports = router;
