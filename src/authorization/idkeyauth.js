'use strict';

const configs = require('../configurations'),
      helpers = require('../helpers'),
      express = require('express'),
      router = express.Router();

module.exports = function (appContext) {

    /* GET /idkeyauth
    * This route is used to initiate the ID/Key Authentication workflow.
    */
    router.get('/idkeyauth', function(req, res) {
        const callbackTarget = helpers.getIdKeyRedirectUri(req);
        const getTokensUrl = appContext.createUrlForAuthentication(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, callbackTarget);
        res.redirect(getTokensUrl);
    });

    /* GET /idkeycallback
    * Once the user has accepted the terms for this application using the ID/Key Authentication
    * workflow they will be redirected back to this route. The returned UserKey and UserId is then saved
    * in a cookie so that later requests can be signed using the user's context.
    */
    router.get('/idkeycallback', function(req, res) {
        const callbackRoute = req.url;
        const userContext = appContext.createUserContext(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, callbackRoute);
        res.cookie(configs.cookieName, { userKey: userContext.userKey, userId: userContext.userId }, configs.cookieOptions);
        res.redirect('/?authenticationType=idkeyauth');
    });

    return router;

};
