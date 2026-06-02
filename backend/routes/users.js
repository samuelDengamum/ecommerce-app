const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', [auth, auth.isAdmin], getUsers);

module.exports = router;
