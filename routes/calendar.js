const { calendarAPI } = require('../utils/calendarAPI')
const User = require('../models/UserModel')
const { jwt } = require('../middlewares/verifyToken')
const router = require('express').Router()

router.get('/list', jwt, async (req, res) => {
  const user = await User.findOne({ email: req.auth.email })
  const events = await calendarAPI.listEvents(user.token)
  res.send(events)
})

module.exports = router
