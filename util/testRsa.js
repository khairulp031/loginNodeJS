const env = require('node-env-file');
env('.env');
const rs = require('jsrsasign');
const rsu = require('jsrsasign-util');
const JWS = rs.jws.JWS;
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const pemFile = rsu.readFile(path.join(__dirname, 'rsa/rsa.prv.pem'));
const privateKey = rs.KEYUTIL.getKey(pemFile, process.env.SECRET);
const header = { 'typ': 'JWT', 'alg': 'RS256', 'kid': 'authserver' };
const payload = { test: 'foo' }
let access_token = JWS.sign(
    header.alg,
    JSON.stringify(header),
    JSON.stringify(payload),
    privateKey);
console.log('access_token', access_token)

const pemFile1 = rsu.readFile(path.join(__dirname, 'rsa/rsa.pub.pem'));
const publicKey1 = rs.KEYUTIL.getKey(pemFile1);
//access_token = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoiZm9vIiwiaWF0IjoxNjY4Nzg1NDgwLCJleHAiOjE2Njg3ODU0ODF9.STYJrKVEp8zkqvx_S3HvXyi5WdvGCvisnE9dQ-pO6AUE_xkLuFCuWy7mi8wuI4wVn3qLK7BPzCHDLpppYTVwbqDrUjFk1Sc87C5qa846hE_Ol7iZChqTTanAloF3Hryc8phUHWVR5Z3BPynCq9hVJ1vKPMl1Yykb8NGwGDnyit1qLYFxV6KPU0FqI81Kb8qDkHvpvVXD60PUX_mqdR0-YeJX3r5RNJNSYTv0TEmpWKucO4ExJoN6NRrdT27i65J2NsbouzjJ28lYjnE1zSCn-ML6lXJ68YPiPPPuoiW734N4mtXxDjCBAb2JwTpKYJUUj_dYPNkWl14kyXtX7LR6iQ"
const decode = JWS.verify(access_token, publicKey1)
console.log('decode', decode);
if (decode) {
    const tokenParts = access_token.split('.');
    const payload = JSON.parse(rs.b64toutf8(tokenParts[1]));
    console.log('Payload', payload);
}


const prvkey = {
    key: fs.readFileSync(path.join(__dirname, 'rsa/rsa.prv.pem'), 'utf8'),
    passphrase: process.env.SECRET
};
const pbckey = fs.readFileSync(path.join(__dirname, 'rsa/rsa.pub.pem'));
var signOptions = {
    expiresIn: "1minute",
    algorithm: "RS512"   // RSASSA [ "RS256", "RS384", "RS512" ]
};
let token = jwt.sign(payload, prvkey, signOptions);
console.log("token", token)
//token = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoiZm9vIiwiaWF0IjoxNjY4Nzk1MjE5LCJleHAiOjE2Njg3OTcwMTl9.Y9inYg2iNXIjlgLfeO0ePR19e9QiN8bHFPpiGaslz3Of2yV2gXj_kuk6GM_p-nahhvj0zE9l2W177keZPGAo_loE7VdJo-BkpJWJ9qq8iTED-_FMHdIFgiXmQH4_Q-yfcr91y3rxkd4dmPvtuP1XQnW1joxIgu8sPGxQDGlWs3ij5nK8rAvRImYJ5Nf_KZihEQ2RNy2yVsEsE-FMDUX0ND__DtzTxE3Ld5HsOsoe0pafg2eyqu4AvWf30jutyeP24C390pQlFR6DWiq_6E6xz-xH2pxnwVShr6yPR2G4sWVQYS5dnGAcYuqnso--JNR__P0_LM4FKn-kD5iqU_VSNg"
try {
    const decoded = jwt.verify(token, pbckey);
    console.log('decoded', decoded);
} catch (e) {
    console.log("error", e)
}