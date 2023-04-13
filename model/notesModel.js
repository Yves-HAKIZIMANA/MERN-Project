const mongoose = require('mongoose')
const autoIncrement = require('mongoose-sequence')(mongoose)

const notesSchema =  new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
    
}, {
    timestamps: true // to record the time at which the notes were created and updated
})

notesSchema.plugin(autoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

const Notes =  mongoose.model('Notes', notesSchema)

module.exports = Notes
