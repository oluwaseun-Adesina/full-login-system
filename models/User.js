const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    date: {
        type: Date,
        default: Date.now
    },
    dateofbirth: {
        type: Date,
    },  
});

const User = mongoose.model('User', userSchema);

module.exports = User;