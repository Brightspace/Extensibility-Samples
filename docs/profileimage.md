# User Profile Image
The code for this API sample can be found in the [profileimage.js]() file. This example shows how to update a user's profile image. This API uses a passed in User Id which by default is set to the 'D2L.Demo Student' user.

## API Route Overview
* [Profile Image API](http://docs.valence.desire2learn.com/res/user.html#post--d2l-api-lp-(version)-profile-user-(userId)-image)
    ```
    /d2l/api/lp/(version)/profile/user/(userId)/image
    ```
* This route uses the RFC1867 HTTP file upload process as described in our api documentation under [Simple uploads](http://docs.valence.desire2learn.com/basic/fileupload.html#simple-uploads)

## The Code
The example provided exposes a route for updating a user's profile image. The user is determined from the ```userId``` query parameter. The index page has this value hardcoded and it can be changed. Please read [Configurations](configurations.md) for more information on making this change.

The route provided is ```/uploadprofileimage```
* When updated the user profile image route only returns a 200 success status no JSON.
* The route can be accessed using OAuth 2.0 Authentication or the ID/Key authentication.
* To view the profile image change navigate to the course classlist where the demo user is enrolled or the updated user's profile page.
* You'll notice that this request still has a boundary similiar to the multipart/mixed request but the Content-Type is actually multipart/form-data which out of the box Superagent will handle for us.
