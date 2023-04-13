const express = require('express')
const router = express.Router()

// handling the user controllers

const {getAllUsers, createNewUser, updateUser, deleteUser} = require('../controllers/userController')

router.get('/', getAllUsers)
// router.post('/registerUser', createNewUser)
// router.patch('/updateUser', updateUser)
// router.delete('/deleteUser', deleteUser)

module.exports = router