
const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const isAdminAuthenticated = require('../middelware/auth'); // Middleware for authentication



// Temporarily removing the middleware
router.post('/create', adminController.createAdmin);
router.post('/login', adminController.adminLogin);
// ✅ Example protected route
router.get("/dashboard", isAdminAuthenticated, (req, res) => {
  res.json({ message: `Welcome, ${req.admin.FirstName}` });
});
// router.get('/dashboard', isAdminAuthenticated, adminController.dashboard);  // Check if this is defined
router.post('/logout', isAdminAuthenticated, adminController.adminLogout);



// Export the routes
module.exports = router;
