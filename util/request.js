const env = require('node-env-file');
env('.env');
const request = require('request');

const post = (server, path, csrf, cookie, data) => {
    return new Promise((resolve, reject) => {
        request.post({
            url: `${server}${path}`,
            headers: {
                cookie: `${cookie};`,
                csrf: `${csrf}`
            },
            json: data
        }, (err, httpResponse, body) => {
            if (err) {
                console.log('post::error', err)
                return reject(err);
            }
            resolve(body);
        });
    });
}


module.exports = {
    post
}