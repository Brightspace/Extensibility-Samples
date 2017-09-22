'use strict';

const 
    d2l = require('valence'),
    express = require('express'),
    request = require('superagent'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    configs = require('./src/configurations'),
    path = require('path'),
    helpers = require('./src/helpers'),
    app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup the initial D2L context object using the configured instance settings.
const appContext = new d2l.ApplicationContext(configs.instanceUrl, configs.applicationId, configs.applicationKey);

// Import Authorization
require('./src/authorization/idkeyauth.js')(app, configs, appContext, helpers);
require('./src/authorization/oauth.js')(app, request, configs, helpers);

// Import Sample API Calls
require('./src/apis/whoami')(app, request, configs, appContext, helpers);
require('./src/apis/content')(app, request, configs, appContext, helpers);
require('./src/apis/grades')(app, request, configs, appContext, helpers);
require('./src/apis/profileimage')(app, request, configs, appContext, __dirname, helpers);

// Import Sample Remote Plugins
require('./src/remote-plugins/isf-cim')(app, request, configs, appContext, path, __dirname, helpers);
require('./src/remote-plugins/quicklink-cim')(app, request, configs, appContext, path, __dirname, helpers);
require('./src/remote-plugins/courseimport-cim')(app, request, configs, appContext, path, __dirname, helpers);
require('./src/remote-plugins/statics.js')(app, express, __dirname, helpers);

/* GET /
* The default server location that will return the index html page.
*/
app.get('/', function(req, res) {
     res.sendFile(path.join(__dirname+'/html/index.html'));
});

module.exports = app;
app.listen(configs.configuredPort);
