const mongoose = require('mongoose');
const {Schema} = mongoose;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    eventDate: {
        type: Date
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId
    }

});

module.exports = mongoose.model('Event', eventSchema);