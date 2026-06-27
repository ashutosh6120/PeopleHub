const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController.js');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth.js');

// Get leaves
router.get('/', authenticateToken, leaveController.getLeaves);

// Get leave balance
router.get('/balance/:employeeId', authenticateToken, leaveController.getLeaveBalance);

// Apply leave
router.post('/', authenticateToken, leaveController.applyLeave);

// Approve/Reject leave (admin only)
router.put('/:id', authenticateToken, authorizeAdmin, leaveController.updateLeaveStatus);

module.exports = router;