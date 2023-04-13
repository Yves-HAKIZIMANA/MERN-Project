require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500
const cookieParser = require('cookie-parser')
const cors = require('cors')

// Cors setup
const corsOptions = require('./config/corsOptions')


// Middlewares
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())
app.use('/', express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/root'))

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if(req.accepts('json')){
        res.json({ message : ' 404 Not found '})
    }else{
        res.type('txt').send('404 Not found')
    }
})

// UserController routes
const userRoute = require('./routes/userRoute')
app.use('/user', userRoute)


// Database Connection
const connectDB = require('./config/dbConn')
const { default: mongoose } = require('mongoose')
connectDB()

mongoose.connection.once('open', () => {
    console.log('The app connected to the database successfully')
    app.listen(PORT, () => console.log(`Server running on this port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
})



