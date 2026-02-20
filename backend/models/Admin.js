const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50  
    },
     
    LastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50  
    },

    Email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/  
    },

    Password: {
        type: String,
        required: true
    },

    Role: {
        type: String,
        required: true,
        default: 'admin'  // Default role for this model
    },


});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
