const rp = require('request-promise')
const moment = require('moment-timezone')

const zoomAPI = {
  async scheduleMeeting(date, duration, topic) {
    const config = {
      token: process.env.ZOOM_JWT_TOKEN,
      email: process.env.ZOOM_EMAIL,
    }
    var options = {
      url: `https://api.zoom.us/v2/users/${config.email}/meetings`,
      method: 'POST',
      auth: {
        bearer: config.token,
      },
      json: true,
      body: {
        start_time: moment(date).tz('Europe/Istanbul').format(),
        duration: duration,
        topic: topic,
        type: 2,
        timezone: 'Europe/Istanbul',
      },
    }

    const res = await rp(options)
    return res
  },
}

module.exports.zoomAPI = zoomAPI
