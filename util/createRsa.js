const env = require('node-env-file');
env('.env');
const rs = require('jsrsasign');
const rsu = require('jsrsasign-util');
const path = require('path');


const keyalg = 'RSA';
const keysize = 2048;
const kp = rs.KEYUTIL.generateKeypair(keyalg, keysize);

const prvKey = kp.prvKeyObj;
const pubKey = kp.pubKeyObj;

const prvKeyPEM = rs.KEYUTIL.getPEM(prvKey, "PKCS8PRV", process.env.SECRET);
const pubKeyPEM = rs.KEYUTIL.getPEM(pubKey);
rsu.saveFile(path.join(__dirname, 'rsa/rsa.prv.pem'), prvKeyPEM)
rsu.saveFile(path.join(__dirname, 'rsa/rsa.pub.pem'), pubKeyPEM)
