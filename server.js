'use strict';

const 
    d2l = require('valence'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    configs = require('./src/configurations'),
    path = require('path'),
    app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup the initial D2L context object using the configured instance settings.
const appContext = new d2l.ApplicationContext(configs.instanceUrl, configs.applicationId, configs.applicationKey);

// Import Authorization
app.use(require('./src/authorization/idkeyauth.js')(appContext));
app.use(require('./src/authorization/oauth.js')());

// Import Sample API Calls
app.use(require('./src/apis/whoami')(appContext));
app.use(require('./src/apis/content')(appContext));
app.use(require('./src/apis/grades')(appContext));
app.use(require('./src/apis/profileimage')(appContext, __dirname));

// Import Sample Remote Plugins
app.use(require('./src/remote-plugins/isf-cim')(appContext, __dirname));
app.use(require('./src/remote-plugins/quicklink-cim')(appContext,__dirname));
app.use(require('./src/remote-plugins/courseimport-cim')(appContext, __dirname));
require('./src/remote-plugins/statics.js')(app, __dirname);

/* GET /
* The default server location that will return the index html page.
*/
app.get('/', function(req, res) {
     res.sendFile(path.join(__dirname+'/html/index.html'));
});

module.exports = app;
app.listen(configs.configuredPort);
