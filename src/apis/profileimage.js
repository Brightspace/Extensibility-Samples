module.exports = function (app, request, configs, appContext, rootDirectory) {

    var helpers = require('../helpers');

    /* GET /uploadprofileimage
    *  Updates the profile image for the user that matches the UserId passed into the route.
    */
    app.get('/uploadprofileimage', function (req, res) {
        var userId = req.query.userId;
        var apiPath = '/d2l/api/lp/1.9/profile/user/' + userId + '/image';
        var accessToken = req.cookies[configs.cookieName].accessToken;

        if (accessToken) {
            console.log('Attempting to upload a user profile image using OAuth 2.0 authentication.');
            var uploadProfileImage = helpers.createUrl(apiPath, configs);
            request
                .post( uploadProfileImage )
                .attach('profileImage', rootDirectory + '/content/profile/profileImage.png')
                .set('Authorization', `Bearer ${accessToken}`)
                .end(function(error, response) {
                     if (error) {
                        console.log("Error calling the who am I route", error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode != 200) {
                        res.status(response.statusCode).send(response.error);
                    } else {
                        res.status(200).send({success: true});
                    }
                });
        } else {
            console.log('Attempting to upload a user profile image using ID Key Authentication.');
            var userId = req.cookies[configs.cookieName].userId;
            var userKey = req.cookies[configs.cookieName].userKey;
            var userContext = appContext.createUserContextWithValues(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, userId, userKey);
            var apiCallUrl = userContext.createAuthenticatedUrl(apiPath, 'POST');
            request
                .post( apiCallUrl )
                .attach('profileImage', rootDirectory + '/content/profile/profileImage.png')
                .end(function(error, response) {
                    if (error) {
                        console.log("Error calling the who am I route", error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode != 200) {
                        res.status(response.statusCode).send(response.error);
                    } else {
                        res.status(200).send({success: true});
                    }
                });
        }

    });

};
