const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const user = new Schema({
    username: {
        type: String,
        required: true,
        unique: [true, 'Username already exists'],
        trim: true
    },

    email :{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
        minLenght: [6, 'Password must be at least 6 characters long']
    }
    
}, {

    timestamps: true
    
    });

user.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = bcrypt.hashSync(this.password, 10);

    next();
});

module.exports = mongoose.model('User', user);


