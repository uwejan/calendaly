const { expressjwt: jwt } = require('express-jwt')

module.exports.jwt = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
})
