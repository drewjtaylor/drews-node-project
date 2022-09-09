const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId
    }

});

module.exports = mongoose.model('User', userSchema);