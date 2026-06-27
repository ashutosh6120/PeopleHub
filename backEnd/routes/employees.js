const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController.js');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth.js');

// Public route (for testing)
router.get('/', authenticateToken, employeeController.getAllEmployees);

// Single employee
router.get('/:id', authenticateToken, employeeController.getEmployeeById);

// Admin only
router.post('/', authenticateToken, authorizeAdmin, employeeController.createEmployee);
router.put('/:id', authenticateToken, authorizeAdmin, employeeController.updateEmployee);
router.delete('/:id', authenticateToken, authorizeAdmin, employeeController.deleteEmployee);

module.exports = router;