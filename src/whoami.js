module.exports = function (app, request, configs, appContext) {

    var helpers = require('./helpers');

    /* GET /whoami
    *  Returns the who am I information based on the currently authenticated user.
    */
    app.get('/whoami', function (req, res) {
        var apiPath = '/d2l/api/lp/1.9/users/whoami';
        var accessToken = req.cookies[configs.cookieName].accessToken;
        if (accessToken) {
            console.log('Attempting to make the Who Am I call using OAuth 2.0 authentication.');
            var whoamiRoute = helpers.createUrl(apiPath, configs);
            request
                .get( whoamiRoute )
                .set('Authorization', `Bearer ${accessToken}`)
                .end(function(error, response) {
                     if (error) {
                        console.log("Error calling the who am I route", error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode != 200) {
                        res.status(response.statusCode).send(response.error);
                    } else {
                        res.status(200).send(response.text);
                    }
                });
        } else {
            console.log('Attempting to make the Who Am I call using ID Key Authentication.');
            var userId = req.cookies[configs.cookieName].userId;
            var userKey = req.cookies[configs.cookieName].userKey;
            var userContext = appContext.createUserContextWithValues(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, userId, userKey);
            var apiCallUrl = userContext.createAuthenticatedUrl(apiPath, 'GET');
            request
                .get( apiCallUrl )
                .end(function(error, response) {
                    if (error) {
                        console.log("Error calling the who am I route", error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode != 200) {
                        res.status(response.statusCode).send(response.error);
                    } else {
                        res.status(200).send(response.text);
                    }
                });
        }

    });

};
