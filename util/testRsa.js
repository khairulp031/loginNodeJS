const env = require('node-env-file');
env('.env');
const rs = require('jsrsasign');
const rsu = require('jsrsasign-util');
const JWS = rs.jws.JWS;
const path = require('path');
const base64url = require('base64url');

const pemFile = rsu.readFile(path.join(__dirname, 'rsa/rsa.prv.pem'));

const privateKey = rs.KEYUTIL.getKey(pemFile, process.env.SECRET);
const header = { 'typ': 'JWT', 'alg': 'RS256', 'kid': 'authserver' };
const access_token = JWS.sign(
    header.alg,
    JSON.stringify(header),
    JSON.stringify({ test: 'foo' }),
    privateKey);
console.log('access_token', access_token)

//const decode0 = JWS.verifyJWT(access_token, process.env.SECRET)
//console.log('decode0', decode0);

const pemFile1 = rsu.readFile(path.join(__dirname, 'rsa/rsa.pub.pem'));
const publicKey1 = rs.KEYUTIL.getKey(pemFile1);
const decode = JWS.verify(access_token, publicKey1)
console.log('decode', decode);
if (decode) {
    const tokenParts = access_token.split('.');
    const payload = JSON.parse(base64url.decode(tokenParts[1]));
    console.log('Payload', payload);
}

