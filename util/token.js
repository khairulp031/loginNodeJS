const env = require('node-env-file');
env('.env');
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const rs = require('jsrsasign');
const rsu = require('jsrsasign-util');
const JWS = rs.jws.JWS;
const path = require('path');
const base64url = require('base64url');

const create = (data) => {
    //return jwt.sign(data, process.env.SECRET, { expiresIn: process.env.TOKEN_MAXAGE });
    const pemFile = rsu.readFile(path.join(__dirname, 'rsa/rsa.prv.pem'));
    const privateKey = rs.KEYUTIL.getKey(pemFile, process.env.SECRET);
    const header = { 'typ': 'JWT', 'alg': 'RS256', 'kid': 'authserver' };

    return JWS.sign(
        header.alg,
        JSON.stringify(header),
        JSON.stringify(data),
        privateKey
    );
}

const cookieObject = () => {
    return {
        secure: /true/i.test(process.env.TOKEN_SECURE),
        httpOnly: /true/i.test(process.env.TOKEN_HTTPONLY),
        path: "/",
        domain: process.env.COOKIE_DOMAIN,
        maxAge: process.env.TOKEN_MAXAGE,
        SameSite: 'None'
    }
}

const createToken = (req, res, next) => {
    const uuid = uuidv4();
    const token = create({ csrf: uuid })
    res.cookie(process.env.COOKIE, token, cookieObject());
    res.json({ status: 'OK', uuid })
}
const verifyJWT = (token) => {
    const pemFile = rsu.readFile(path.join(__dirname, 'rsa/rsa.pub.pem'));
    const publicKey = rs.KEYUTIL.getKey(pemFile);
    const isValid = JWS.verify(token, publicKey);
    if (isValid) {
        const tokenParts = token.split('.');
        const payload = JSON.parse(base64url.decode(tokenParts[1]));
        return payload;
    }
    return {};
}
const verifyToken = (req, res, next) => {
    try {
        const headers = req.headers
        const cookie = headers['cookie']
        let token = cookie.split(';')
        token = token[0].split('=')
        token = token[1]
        const csrf = headers['csrf']
        //const decoded = jwt.verify(token, process.env.SECRET);
        const decoded = verifyJWT(token);
        if (decoded && decoded.csrf === csrf) {
            return next();
        }
    } catch (e) {
    }
    return res.status(403).send({
        status: 'ERROR',
        message: "insufficient permission."
    });
}
const getTokenData = (req) => {
    try {
        const headers = req.headers
        const cookie = headers['cookie']
        let token = cookie.split(';')
        token = token[0].split('=')
        token = token[1]
        const tokenParts = token.split('.');
        const payload = JSON.parse(base64url.decode(tokenParts[1]));
        return payload;
    } catch (e) {
    }
    return null;
}

const verifyLogin = (req, res, next) => {
    try {
        const data = getTokenData(req)
        if (data.username) {
            return next();
        }
    } catch (e) {
    }
    return res.status(403).send({
        status: 'ERROR',
        message: "insufficient permission."
    });
}

module.exports = {
    createToken,
    verifyToken,
    getTokenData,
    create,
    cookieObject,
    verifyLogin
}