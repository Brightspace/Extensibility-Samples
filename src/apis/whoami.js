'use strict';

const configs = require('../configurations'),
      helpers = require('../helpers'),
      request = require('superagent'),
      express = require('express'),
      router = express.Router();

module.exports = function (appContext) {

    /* GET /whoami
    *  Returns the who am I information based on the currently authenticated user.
    */
    router.get('/whoami', function (req, res) {
        const apiPath = '/d2l/api/lp/1.9/users/whoami';
        const accessToken = req.cookies[configs.cookieName].accessToken;
        if (accessToken) {
            console.log('Attempting to make the who am I call using OAuth 2.0 authentication.');
            const whoamiRoute = helpers.createUrl(apiPath, configs);
            request
                .get( whoamiRoute )
                .set('Authorization', `Bearer ${accessToken}`)
                .end(function(error, response) {
                     if (error) {
                        console.log('Error calling the who am I route', error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode !== 200) {
                        res.status(response.statusCode).send(response.error);
                    } else {
                        res.status(200).send(response.text);
                    }
                });
        } else {
            console.log('Attempting to make the who am I call using ID Key Authentication.');
            const userId = req.cookies[configs.cookieName].userId;
            const userKey = req.cookies[configs.cookieName].userKey;
            const userContext = appContext.createUserContextWithValues(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, userId, userKey);
            const apiCallUrl = userContext.createAuthenticatedUrl(apiPath, 'GET');
            request
                .get( apiCallUrl )
                .end(function(error, response) {
                    if (error) {
                        console.log('Error calling the who am I route', error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode !== 200) {
                        res.status(response.statusCode).send(response.error);
                    } else {
                        res.status(200).send(response.text);
                    }
                });
        }

    });

    return router;
};
