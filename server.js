const express = require('express')
const app = express()
const env = require('node-env-file');
env('.env');
const path = require('path')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const { nohttp, nocache } = require('./util/setHeader')
const { startDB, stopDB } = require('./util/mongodb')

startDB(process.env.DB_STR)

app.use(compression())
app.use(express.json({
    limit: process.env.FILE_LIMIT || '5mb'
}))
app.use(express.urlencoded({
    limit: process.env.FILE_LIMIT || '5mb'
}))
app.use(cookieParser({
    limit: process.env.FILE_LIMIT || '5mb'
}));
app.use(nohttp)

const api = require('./routing/index')
app.use('/api', nocache, api)

const server = app.listen(process.env.PORT || 3000)
server.timeout = parseInt(process.env.DEFAULT_TIMEOUT);