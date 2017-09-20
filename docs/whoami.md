# Who Am I
The code for this API sample can be found in the [whoami.js]() file. This example shows how to call one of the most basic APIs Brightspace has to offer. This API should be available to every user who authenticates and is a good way to ensure that your chosen Authentication workflow has resulted in successfull authentication with Brightspace.

## API Route Overview
* [Who Am I API](http://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-users-whoami)
    ```
    /d2l/api/lp/(version)/users/whoami
    ```

## The Code
The exampled provided exposes a route for accessing the Who Am I response for the currently authenticated user.

The route provided is ```/whoami```
* This route returns the information retrieved from Brightspace for the currently authenticated user.
* The route can be accessed using OAuth 2.0 Authentication or the ID/Key authentication.