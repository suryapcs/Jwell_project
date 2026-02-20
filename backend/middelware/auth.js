// middleware/auth.js
const Admin = require('../models/Admin');  // Ensure correct path to Admin model

const isAdminAuthenticated = async (req, res, next) => {
    if (!req.session.adminId) {
        return res.status(401).json({ message: 'Admin not authenticated' });
    }

    try {
        const admin = await Admin.findById(req.session.adminId);
        if (!admin) {
            return res.status(401).json({ message: 'Invalid session. Admin not found' });
        }
        req.admin = admin;  // Attach admin info to request object
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error while checking authentication' });
    }
};

module.exports = isAdminAuthenticated;
