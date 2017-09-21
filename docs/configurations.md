# Configurations
When first using the samples, no configuration should be neccessary. The default configurations are setup against the [Devcop Brigthspace Instance](https://devcop.brightspace.com/d2l/login). Login credentials for this site can be accessed from the [Brigthspace Community Developer Group](https://community.brightspace.com/s/group/0F9610000001mZ1CAI). In order to access them you must be a member.

## Configuration File
Several different configurations can be set an environment level or directly in the [configurations.js](../src/configurations.js) file. The following configurations are available in this file:
* ```applicationId``` (string)
    * A string containing the Application Id granted by the LMS using the 'Manage Extensibility' tool. This is used for the [ID/Key Authentication](authentication.md) workflow.
* ```applicationKey``` (string)
    * A string containing the Application Key granted by the LMS using the 'Manage Extensibility' tool. This is used for the [ID/Key Authentication](authentication.md) workflow.
* ```authCodeScope``` (string)
    * A string containing the scope(s) required for the application that enable the OAuth 2.0 authentication method to be used when making the sample API calls. This is used for the [OAuth 2.0 Authentication](authentication.md) workflow.
* ```authEndpoint``` (string/URL)
    * This is the authentication endpoint/URL that is used in the [OAuth 2.0 Authentication](authentication.md) workflow when requesting an Authentication Token. The value for this route was obtained from [here](http://docs.valence.desire2learn.com/basic/oauth2.html#setting-up-oauth-2-0-authentication).
* ```clientId``` (string)
    * A string containing the ClientId granted by the LMS using the 'Manage Extensibility' tool. This is used for the [OAuth 2.0 Authentication](authentication.md) workflow.
* ```clientSecret``` (string)
    * A string containing the Client Secret granted by the LMS using the 'Manage Extensibility' tool. This is used for the [OAuth 2.0 Authentication](authentication.md) workflow.
* ```configuredPort``` (number)
    * If self-signed certificate is not being used ([server-local.js](../server-local.js)), then this port will be the port where the node server will listen for requests.
* ```cookieName``` (string)
    * The name for the cookie where the Access Token or the UserKey/UserId is saved for later retrieval.
* ```cookieOptions``` (object)
    * The options for the cookie. By default the cookie is set to be HTTP Only and Secured.
* ```instanceScheme``` (string)
    * The HTTP scheme that the instance you are connecting to uses. The value should be either 'http:' or 'https:'.
* ```instancePort``` (number)
    * The port that the instance you are connecting to uses. Most likely this should be set to 443.
* ```instanceUrl``` (string)
    * The URL for the instance that you are connect to. This should NOT include the scheme as described above. An example value for this is: 'devcop.brightspace.com'.
* ```ltiSecret``` (string)
    * The LTI secret that will be used to validate LTI requests coming from the Brightspace instance. This is the secret that will need to be used when setting up the Remote Plugin examples.
* ```state``` (string)
    * The state is a value sent with the initial [OAuth 2.0](authentication.md) request to the Authentication Endpoint. When the OAuth 2.0 callback is called, the state will be passed in and can be verified with this configured value to ensure the callback was initiated from the proper location. **This value was hardcoded for the sample but normally should change with each OAuth workflow and stored securely. The state helps protect against [CSRF](https://tools.ietf.org/html/rfc6749#section-10.12) and should be a non-guessable value as described [here](https://tools.ietf.org/html/rfc6749#section-10.10).**
* ```tokenEndpoint``` (string/URL)
    * This is the token endpoint/URL that is used in the [OAuth 2.0 Authentication](authentication.md) workflow when exchanging an Authentication Token for an access token. The value for this route was obtained from [here](http://docs.valence.desire2learn.com/basic/oauth2.html#setting-up-oauth-2-0-authentication).

## Index Page
The [index.html]() page has several hardcoded values that indicate to the underlying sample API calls where to execute those calls. These hardcoded values can be found as query parameters on several of the links. The following links are available to be configured:
* ```https://localhost:3434/finalgrades?orgUnitId=6631```
    * ```orgUnitId``` can be configured to any course where you would like to pull Final Grade Information From.
* ```https://localhost:3434/uploadprofileimage?userId=172```
    * ```userId``` can be configured to be any user who's profile you would like to update.
* ```https://localhost:3434/uploadhtmlcontent?orgUnitId=6631&moduleId=1940```
    * ```orgUnitId``` can be updated to the course where you would like to upload content to.
    * ```moduleId``` can be updated to the module in content where you would like the new file to be added.
* ```https://localhost:3434/uploadworddocument?orgUnitId=6631&moduleId=1940```
* ```orgUnitId``` can be updated to the course where you would like to upload content to.
    * ```moduleId``` can be updated to the module in content where you would like the new file to be added.
* Note: if you are changing the values for the content route be sure to checkout the [content.js](../src/content.js) file in order to update the topic data block to point to the proper content location ('Url' field):
    ```javascript
        var topicData = {
            Title: "Sample Word Document Content",
            ShortTitle: null,
            Type: 1,
            TopicType: 1,
            Url: "/content/enforced/6631-AS200/sample-content.html",
            StartDate: null,
            EndDate: null,
            DueDate: null,
            IsHidden: false,
            IsLocked: false,
            OpenAsExternalResource: null,
            Description: null,
            MajorUpdate: null,
            MajorUpdateText: null,
            ResetCompletionTracking: null
        };
    ```