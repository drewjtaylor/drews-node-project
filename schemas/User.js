const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: false
    },

});

module.exports = mongoose.model('User', userSchema);