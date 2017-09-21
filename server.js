var 
    d2l = require('valence'),
    express = require('express'),
    request = require('superagent'),
    bodyParser = require('body-parser'),
    querystring = require('querystring'),
    cookieParser = require('cookie-parser'),
    configs = require('./src/configurations'),
    path = require('path'),
    helpers = require('./src/helpers'),
    app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup static folders for serving up content to the Remote Plugins.
app.use("/content/isf", express.static(__dirname + '/content/isf'));
app.use("/content/quicklink", express.static(__dirname + '/content/quicklink'));
app.use("/content/importpackage", express.static(__dirname + '/content/importpackage'));

// Setup the initial D2L context object using the configured instance settings.
var appContext = new d2l.ApplicationContext(configs.instanceUrl, configs.applicationId, configs.applicationKey);

// Import Sample API Calls
require('./src/whoami')(app, request, configs, appContext);
require('./src/content')(app, request, configs, appContext);
require('./src/grades')(app, request, configs, appContext);

// Import Sample Remote Plugins
require('./src/remote-plugins/isf-cim')(app, request, configs, appContext, path, __dirname);
require('./src/remote-plugins/quicklink-cim')(app, request, configs, appContext, path, __dirname);
require('./src/remote-plugins/courseimport-cim')(app, request, configs, appContext, path, __dirname);

/* GET /
* The default server location that will return the index html page.
*/
app.get('/', function(req, res) {
     res.sendFile(path.join(__dirname+'/html/index.html'));
});

/* GET /idkeyauth
* This route is used to initiate the ID/Key Authentication workflow.
*/
app.get('/idkeyauth', function(req, res) {
    var callbackTarget = helpers.getIdKeyRedirectUri(req);
	var getTokensUrl = appContext.createUrlForAuthentication(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, callbackTarget);
    res.redirect(getTokensUrl);
});

/* GET /idkeycallback
* Once the user has accepted the terms for this application using the ID/Key Authentication
* workflow they will be redirected back to this route. The returned UserKey and UserId is then saved
* in a cookie so that later requests can be signed using the user's context.
*/
app.get('/idkeycallback', function(req, res) {
    var callbackRoute = req.url;
    var userContext = appContext.createUserContext(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, callbackRoute);
    res.cookie(configs.cookieName, { userKey: userContext.userKey, userId: userContext.userId }, configs.cookieOptions);
    res.redirect('/?authenticationType=idkeyauth');
});

/* GET /oauth
*   This endpoint is used to redirect the user to the authentication route
*   on the learning environment side so that the user can confirm
*   that they want allow this application to make API requests on
*   their behalf.
*/
app.get('/oauth', function(req, res) {
    var authCodeParams = querystring.stringify({
        response_type: "code",
        redirect_uri: helpers.getRedirectUri(req),
        client_id: configs.clientId,
        scope: configs.authCodeScope,
        state: configs.state
    });
    res.redirect(configs.authEndpoint + '?' + authCodeParams);
});

/* GET /oauthcallback
*   This endpoint is the callback provided when setting up an oauth
*   client in the learning environment and is called after the user has 
*   granted permission for this application to make API requests. This
*   method takes the authorization code and exchanges it for
*   the token(stores it in a cookie) that can then be used to make API requests.
*/
app.get('/oauthcallback', function(req, res) {
    var authorizationCode = req.query.code;
    var state = req.query.state;
    if (state !== configs.state) {
        console.log("The state value from the authorization request was incorrect.");
        res.status(500).send({ error: "STATE mistmatch - authorization request could not be completed." });
        return;
    }
    var payload = querystring.stringify({ 
        grant_type: "authorization_code", 
        redirect_uri: helpers.getRedirectUri(req), 
        code: authorizationCode
    });

    request
        .post(configs.tokenEndpoint)
        .auth(configs.clientId, configs.clientSecret)
        .send(payload)
        .end(function(err, response) {
            if (err) {
                console.log('Access Token Error', err.response || err);
                res.redirect('/auth');
            } else if(response.statusCode != 200) {
                res.status(response.statusCode).send(response.error);
            } else {
                var accessToken = response.body.access_token;
                res.cookie(configs.cookieName, { accessToken: accessToken }, configs.cookieOptions);
                res.redirect('/?authenticationType=oauth');
            }
        });
});

module.exports = app;
app.listen(configs.configuredPort);
