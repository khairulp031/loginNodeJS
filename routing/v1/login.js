const env = require('node-env-file');
env('.env');
const express = require('express')
const router = express.Router()
const { getTokenData, create, cookieObject, createToken } = require('../../util/token')

router.get('/createtoken', createToken)

router.post('/', async function (req, res) {
    console.log('req', req.body)
    /*
     validate username and password....
    */
    const tokenData = getTokenData(req)
    const token = create({ csrf: tokenData.csrf, username: req.body.username })
    res.cookie(process.env.COOKIE, token, cookieObject());
    res.json({ status: 'OK', login: "OK", username: req.body.username })
})

router.delete('/', createToken)


module.exports = router