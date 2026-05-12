const Admin = require('../models/Admin'); // Ensure correct path
const { Customer } = require('../models/Customer'); // For dashboard stats
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
//const verifyAdmin = require('../middelware/auth'); // Protect routes using session-based admin check
const { adminValidationSchema } = require('../validation/adminvalidation'); // Validation schema
process.env.DOTENV_LOG = "false";
require("dotenv").config();
 
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Create a new admin
const createAdmin = async (req, res) => {
    // Validate input data before creating an admin
    const { error } = adminValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    console.log('Received request body:', req.body); // Debugging log
    const { FirstName, LastName, Email, Password } = req.body;

    try {
        // Check if admin already exists by Email
        let admin = await Admin.findOne({ Email });
        if (admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

      

        // Create a new Admin object
        admin = new Admin({
            FirstName,
            LastName,
            Email,
            Password,
           
           
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        admin.Password = await bcrypt.hash(Password, salt);

        // Save the new admin to the database
        await admin.save();

        // Send welcome email
       const mailOptions = {
            from: process.env.EMAIL_USER,
            to: Email,
            subject: 'Welcome to the Admin Panel',
            text: `Hello ${FirstName}, welcome to the admin panel!`,
            };


        // Send email asynchronously and handle errors
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.response);
        } catch (emailError) {
            console.error('Error occurred while sending email:', emailError);
        }

        // Return success message and AdminId
        res.status(201).json({
            message: 'Admin registered successfully',
            
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// In your adminController.js (login function)
const adminLogin = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        if (!Email || !Password) {
            return res.status(400).json({ message: 'Please provide both email and password' });
        }

        const admin = await Admin.findOne({ Email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials: Admin not found' });
        }

        const isMatch = await bcrypt.compare(Password, admin.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials: Incorrect password' });
        }

        // Store the admin ID in session after successful login
        req.session.adminId = admin._id; 

        res.status(200).json({ message: 'Admin logged in successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error', details: err.message });
    }
};


const dashboard = async (req, res) => {
    try {
        // Fetch the number of admins and customers
        const totalAdmins = await Admin.countDocuments();
        const totalCustomers = await Customer.countDocuments();

        // Recent 5 admins
        const recentAdmins = await Admin.find().sort({ createdAt: -1 }).limit(5);

        // Create a dashboard summary
        const dashboardData = {
            totalAdmins,
            totalCustomers,
            recentAdmins,
        };

        // Send the dashboard data as JSON response
        res.status(200).json({
            message: 'Admin dashboard accessed successfully',
            dashboardData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving dashboard data' });
    }
};

const adminLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
};


module.exports = { createAdmin ,
                   adminLogin,
                   adminLogout,
                   dashboard
                
};