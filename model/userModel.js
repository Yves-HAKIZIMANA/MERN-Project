const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema =  new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    roles: [{
        type: String,
        default: 'Employee'
    }],
    active: [{
        type: Boolean,
        default: true
    }],
    
})

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 10)
})

const User = mongoose.model('User', userSchema)
module.exports = User
