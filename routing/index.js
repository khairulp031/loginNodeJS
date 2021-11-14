const express = require('express')
const router = express.Router()
const login = require('./v1/login')
router.use('/v1/login', login)

module.exports = router