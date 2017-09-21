module.exports = function (app, request, configs) {

    var helpers = require('../helpers'),
        querystring = require('querystring');
        
    /* GET /oauth
    *   This endpoint is used to redirect the user to the authentication route
    *   on the learning environment side so that the user can confirm
    *   that they want allow this application to make API requests on
    *   their behalf.
    */
    app.get('/oauth', function(req, res) {

        // The state value is hardcoded for the sample but normally should change with each request to the
        // authentication endpoint and then stored securely. Please read the configuration.md readme for
        // more information.
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
};
