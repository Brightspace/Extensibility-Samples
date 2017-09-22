# Authentication
This project implements the ability to toggle between both authentication methods that Brightspace provides:
* [OAuth 2.0](http://docs.valence.desire2learn.com/basic/oauth2.html)
* [ID/Key Authentication](http://docs.valence.desire2learn.com/basic/auth.html)

See [Configurations](/docs/configurations.md) for details on how to set the various configurations that are used in the authentication process.

## ID/Key Authentication
The code for the ID/Key Authentication can be found in the [idkeyauth.js](../src/authorization.js) file. The following outlines the implemented functionality:
* There are several different open source SDKs built by D2L that implement the ID/Key Authentication protocal. This solution is using the [JavaScript SDK](https://github.com/Brightspace/valence-sdk-javascript) and is imported in the project in the server.js file with the following code:
    ```javascript
    d2l = require('valence')
    ```
* Once the SDK is imported we can create application context using the Instance URL, the Application Key and the Application Id. The Application Key and Application Id are received when an application is registered in Brightspace using the 'Manage Extensibility' tool. The code for creating this context is:
    ```javascript
    var appContext = new d2l.ApplicationContext(configs.instanceUrl, configs.applicationId, configs.applicationKey);
    ```
* The ```/idkeyauth``` route exists in the project to initiate the ID/Key Authentication protocol using the created application context. When this route is navigated to in the browser the user is redirected to the Learning Environment where they are pompted to accept the application's ability to make APIs on their behalf. You can see in the callback that we call the [```createUserContext```](https://github.com/Brightspace/valence-sdk-javascript/blob/master/lib/valence.js#L266) which grabs userId and userKey from the query parameters returned from Brightspace.
* Once they have accepted the terms the user is redirected to the  ```/idkeycallback``` route where the received userKey and userId are stored in a cookie so that subsequent requests can be signed using this context. The follwing code is how the context is setup again and used:

    ```javascript
    // Grab the UserId and UserKey from the cookie.
    var userId = req.cookies[configs.cookieName].userId;
    var userKey = req.cookies[configs.cookieName].userKey;
    
    // Setup user context using the values from the cookie.
    var userContext = appContext.createUserContextWithValues(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, userId, userKey);
    
    // Create an authenticated URL using the SDK.
    var apiCallUrl = userContext.createAuthenticatedUrl(apiPath, 'GET');
    ```

## OAuth 2.0
The code for the OAuth 2.0 implementation can be found in the [oauth.js](../src/authorization/oauth.js) file. Out of the box there are many supported OAuth 2.0 libraries that you can use in order to make your authenticated requests and support you through the authentication workflow. One thing to keep in mind is that OAuth 2.0 requires the calling application to be granted ```scopes``` that represent what routes the OAuth client can execute. 

Currently for the samples the following scopes:
* ```core:*:*```

The following is the workflow the sample has implemented:
* When the ```/oauth``` route is navigated to in the browser the OAuth 2.0 implementation is initiated.
* The first order of business is to attain an authorization code from the [Authorization Endpoint](http://docs.valence.desire2learn.com/basic/oauth2.html#setting-up-oauth-2-0-authentication). In order to recieve an auth code there are several configurations that need to be sent as query parameters. The following code illustrates this:
    ```javascript
    // Using the imported 'querystring' library, create the query parameter list passing in the required variables.
    var authCodeParams = querystring.stringify({
        response_type: "code",
        redirect_uri: configs.getRedirectUri(req),
        client_id: configs.clientId,
        scope: configs.authCodeScope,
        state: configs.state
    });
    
    // Redirect the user to the authentication endpoint with the query parameters.
    res.redirect(configs.authEndpoint + '?' + authCodeParams);
    ```
* Once the user has granted the application permission the user is redirected back to the ```/oauthcallback``` route. In the callback the recieved Authorization Code is exchanged for an Access Token by calling the [Token Endpoint](http://docs.valence.desire2learn.com/basic/oauth2.html#setting-up-oauth-2-0-authentication) that can then be used to make API calls. The following code is responsible for this exchange:
    ```javascript
    // Retrieve the authorization code from the query parameter.
    var authorizationCode = req.query.code;
    
    // Verify that the state passed into the request for an Auth code matches the state passed back to the callback.
    var state = req.query.state;
    if (state !== configs.state) {
        console.log("The state value from the authorization request was incorrect.");
        res.status(500).send({ error: "STATE mistmatch - authorization request could not be completed." });
        return;
    }
    
    // Set the values that will be sent to the Token Endpoint through the body of the request.
    var payload = querystring.stringify({ 
        grant_type: "authorization_code", 
        redirect_uri: configs.getRedirectUri(req), 
        code: authorizationCode
    });
    
    // Using the 'superagent' library with the clientId and ClientSecret sent through the headers as Basic Authorization and the payload sent as the body.
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
                // Save the access token into a cookie to be retrieved later in order to make a request.
                res.cookie(configs.cookieName, { accessToken: accessToken }, configs.cookieOptions);
                // Redirect the user back to the index page.
                res.redirect('/?authenticationType=oauth');
            }
        });
    ```
* Now that the Access Token has been saved in the cookie, it can be retrieved later and added as an 'Authorization' header in API requests. The following is an example of this:
    ```javascript
    // Retrieve access token from the cookie.
    var accessToken = req.cookies[configs.cookieName].accessToken;
    
    // Set the Authorization header with the access token.
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
    ```
