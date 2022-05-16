const { google } = require('googleapis')
const moment = require('moment') // require

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar']

const credentials = require('./../credentials.json')
const readline = require('readline')
const fs = require('fs')
const { client_secret, client_id, redirect_uris } = credentials.installed
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
)

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

const calendarAPI = {
  authClient() {
    return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
  },
  async getAccessToken(code) {
    return new Promise(function (resolve, reject) {
      oAuth2Client.getToken(code, (err, token, res) => {
        if (err) {
          reject(err)
        }
        resolve(token)
      })
    })
  },
  genAuthURL() {
    const oAuth2Client = module.exports.calendarAPI.authClient()
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })
  },
  async listEvents(token) {
    let events
    oAuth2Client.setCredentials(token)
    //const date = moment().subtract(17, 'days').toISOString()
    const date = moment().toDate().toISOString()
    return new Promise((resolve, reject) => {
      calendar.events.list(
        {
          calendarId: 'primary',
          timeMin: date,
          maxResults: 100,
          singleEvents: true,
          orderBy: 'startTime',
        },
        (err, res) => {
          if (err) {
            console.log('The API returned an error: ' + err)
            reject('The API returned an error: ' + err)
            return
          }
          events = res.data.items
          resolve(events)
        }
      )
    })
  },
  async checkEventConflict(token, date, duration) {
    const max = date.clone()
    max.add(duration, 'minutes')

    oAuth2Client.setCredentials(token)

    const res = await calendar.freebusy.query({
      requestBody: {
        items: [
          {
            id: 'primary',
          },
        ],
        timeMin: date.toISOString(),

        timeMax: max.toISOString(),
        //timeZone: 'Europe/Istanbul',
        timeZone: 'UTC',
      },
    })
    return res.data.calendars.primary.busy
  },
  async insertEvent(token, date, duration, attendees, link, title) {
    const max = date.clone()
    max.add(duration, 'minutes')
    let events
    oAuth2Client.setCredentials(token)
    return new Promise((resolve, reject) => {
      calendar.events.insert(
        {
          calendarId: 'primary',
          maxAttendees: 2,
          requestBody: {
            end: { dateTime: max.toISOString() },
            start: { dateTime: date.toISOString() },
            attendees: attendees,
            description: link,
            summary: title,
          },
        },
        (err, res) => {
          if (err) {
            console.log('The API returned an error: ' + err)
            reject('The API returned an error: ' + err)
            return
          }
          events = res
          resolve(events)
        }
      )
    })
  },
}

module.exports.calendarAPI = calendarAPI
