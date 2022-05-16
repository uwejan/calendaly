const { calendarAPI } = require('../utils/calendarAPI')
const User = require('../models/UserModel')
const { jwt } = require('../middlewares/verifyToken')
const router = require('express').Router()

router.get('/create/url', jwt, (req, res) => {
  const authURL = calendarAPI.genAuthURL()
  res.send(authURL)
})

router.get('/auth/back', (req, res) => {
  res.send({ code: req.query.code })
})

router.post('/auth/store', jwt, async (req, res) => {
  const token = await calendarAPI.getAccessToken(req.body.code)
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { code: req.body.code, token: token }
  )
  res.send(user)
})

module.exports = router
