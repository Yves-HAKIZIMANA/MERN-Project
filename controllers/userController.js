const User = require('../model/userModel')
const Notes = require('../model/notesModel')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')


// User Controllers simply the logic of handling the Apis

// Getting all the users 
const getAllUsers = asyncHandler (async ( req, res) => {

    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
})

// creating the new user
const createNewUser = asyncHandler (async (req, res) => {
    // start by destructuring the request body
    const { username, password, roles} = req.body

    // check, validate and confirm data
    if(!username || !password || !Array.isArray(roles) || !roles.length){
        res.status(400).json({ message: 'All fields are required please'})
    }

    // Checking for duplicate

    const duplicate = await User.findOne({ username}).lean().exec()

    if(duplicate){
        return res.status(409).json({ message: 'Duplicate user'})
    }

    // hashing the passwords

    // creating and storing the new user in the database
    const userObject = { username, password, roles}

    const user = await User.create(userObject)

    // Checking if the user is created or not
    if(user){
        return res.status(201).json({ message: `New user {username} was created`})
    } else {
        return res.status(400).json({ message: 'Invalid data was received'})
    }



})

// updating the user
const updateUser = asyncHandler ( async ( req, res) => {
    const { id, username, password, active, roles} = req.body

    // Confirm and partial valiadate the data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
        return res.status(400).json({ message: 'All fields are required please'})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(404).json({ message: 'The user not found'})
    }

    // Checking for the duplicate again
    const duplicate = await User.findOne({username}).lean().exec()

    if(duplicate && duplicate?._id.toString() !== id ){
        return res.status(409).json({ message : 'Duplicate username'})
    }

    user.username = username
    user.roles  = roles
    user.active = active

    // if(password){
    //     user.password = bcrypt.hash(password, 10)
    // }

    const updatedUser = await User.save()

    res.json({ message: `${updateUser.username} updated`})


})

// deleting the user
const deleteUser = asyncHandler ( async ( req, res) => {

    const { id } = req.body
    if(!id){
        return res.status(400).json({ message: 'User ID required'})
    }

    const notes  = await Notes.findOne({ user: id}).lean().exec()
    if(notes?.length){
        return res.status(400).json({ message: 'User has assigned notes'})
    }
    const user = await User.findById(id).exec()
    if(!user){
        return res.status(400).json({ message: 'User not found'})
    }

    const deleteAction = await user.deleteOne()

    const replyAction  = `Username ${deleteAction.username} with ID ${deleteAction._id} was successfully deleted`

    res.json(replyAction)
})

module.exports = {
    getAllUsers, 
    createNewUser,
    updateUser,
    deleteUser
}