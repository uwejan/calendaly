const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv/config') // Environment variables

// Route imports
const authRoutes = require('./routes/auth')
const userMeetings = require('./routes/createMeeting')
const gAuth = require('./routes/gAuth')
const calendarRoutes = require('./routes/calendar')

// Middlewares
app.use(cors())
app.use(express.json())
// -> Route Middlewares


// register and login
app.use('/api/auth', authRoutes)

// create auth url, callback, store token in database
app.use('/api/google', gAuth)

// List google calender events for logged-in user
app.use('/api/user/events', calendarRoutes)


// generate meeting and return meeting payload
app.use('/api/user/meetings', userMeetings)


// Connect to Database
mongoose.connect(process.env.DB_URL, () => {
  console.log('Connected to Database')
})

// Starting the server
app.listen(process.env.PORT, () => {
  console.log(`Application running at http://localhost:${process.env.PORT}/`)
})
