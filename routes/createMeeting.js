const router = require('express').Router()
const { jwt } = require('../middlewares/verifyToken')
const moment = require('moment-timezone')
const { zoomAPI } = require('../utils/zoomAPI')
const User = require('../models/UserModel')
const { calendarAPI } = require('../utils/calendarAPI')
const { newMeetingValidation } = require('../utils/validations')

router.post('/create', jwt, async (req, res) => {
  // Validation check
  const { error } = newMeetingValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const payload = {
    date: req.body.meeting_start_date,
    hour: req.body.meeting_start_hour,
    minute: req.body.meeting_start_minute,
    duration: req.body.meeting_duration,
    title: req.body.meeting_title,
  }

  let date = moment(payload.date)
    .set('hours', payload.hour)
    .set('minutes', payload.minute)
    .set('seconds', 0)

  const user = await User.findOne({ email: req.auth.email })

  const conflictResult = await calendarAPI.checkEventConflict(
    user.token,
    date,
    30
  )

  if (typeof conflictResult !== 'undefined' && conflictResult.length > 0) {
    res.send('The time conflicts with another meeting')
  } else {
    const meeting = await zoomAPI.scheduleMeeting(
      date,
      parseInt(payload.duration),
      payload.title
    )

    const calendarInsert = await calendarAPI.insertEvent(
      user.token,
      date,
      30,
      [user.email.toString(), user.email.toString()],
      meeting.start_url,
      payload.title
    )

    /// Store record in the database

    /// Generate invite.ics

    /// Generate email template
    /// Send email attached invite.ics

    res.send({ meeting, calendarInsert })

  }
})

module.exports = router
