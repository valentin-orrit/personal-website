const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    bodyHtml: {  // Add this field
        type: String,
        required: true
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
    updatedAt : {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Log', LogSchema)