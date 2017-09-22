var https = require('https');
var selfSigned = require('openssl-self-signed-certificate');

var app = require('./server');

var httpsPort = process.env.HTTPS_PORT || 3434;
var options = {
    key: selfSigned.key,
    cert: selfSigned.cert
};

https.createServer(options, app).listen(httpsPort);
console.log(`HTTPS started on port ${httpsPort}`);
console.log(`Navigate to https://localhost:${httpsPort}`);