const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    text: {
        type: String,
        require: true,
        trim: true
    },
    created_date: {
        type: Number,
        require: true        
    },
    isRead: {
        type: Boolean,
        default: false        
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

}, { versionKey: false })


const Message = mongoose.model('Message', messageSchema)

module.exports = Message