# Brightspace Extensibility Examples
This project has several sample routes exposed through a Node server that can be used in order to execute sample extensibility functionality that Brightspace provides. The samples are a good place to start when looking to extend the Brightspace platform using APIs or Remote Plugins over LTI. Initially we targeted some popular requests and some APIs that can be complex to use with intent of adding more examples in the future. To learn more or ask questions specific to your needs of extending the platform, the [Brightspace Community](https://community.brightspace.com/s/) is a great place to visit.

Please note, this repo is not intended to be used as production code.

## Setup
Out of the box this solution was built to work with the Devcop Brightspace instance that is available through the Brightspace Community Developer group. If you are not a member, you can easily join in order to access credentials for the Devcop instance. To register you can sign up [here](https://community.brightspace.com/SelfRegistration) and access the Developer group [here](https://community.brightspace.com/s/group/0F9610000001mZ1CAI).

#### Running Locally
1. Make sure you have [Node](https://nodejs.org/en/) installed locally on your computer.
2. Download the latest release of the code.
3. Open a command terminal at the root of the project.
4. Execute the following command to install the required packages for the project:
    ```shell
    npm install
    ```
5. Now that the required Node packages are installed the local node server can be started by running:
    ```shell
    npm run local
    ```
6. The server should now be up and running locally and in a browser you can navigate to:
    https://localhost:3434

\* Note: The reason we have to create a self signed certificate and host over HTTPS is that the OAuth 2.0 Authentication method requires an HTTPS endpoint. This means that in a browser such as Chrome you may have to accept and/or proceed the warning presented when first accessing the index page.

## Configurations
There are several different configurations that can be used to change how some of the APIs work and what the APIs execute against. For a detailed description of what the configurations are and how you can change them please see [Configurations](/docs/configurations.md).

**It is not recommended to commit your application key or client secret to ANY repository. In the configurations file the keys were generated against the devcop Brightspace instance which can be used for developer testing.**

## Authentication
When using the Brightspace APIs there are two available authentication methods:
* [OAuth 2.0](http://docs.valence.desire2learn.com/basic/oauth2.html)
* [ID/Key Authentication](http://docs.valence.desire2learn.com/basic/auth.html)

The sample solution provided allows you to toggle between both implementations and all sample API requests have been written to perform the call with both authentication types. See [Authentication](/docs/authentication.md) for further details on this implementation.

## API Samples
The following API samples are available in this solution:
* [Upload a File to Content](/docs/content.md)
* [Get All Final Grades in a Course](/docs/finalgrades.md)
* [Who Am I](/docs/whoami.md)

## Content Item Message (CIM) Samples
The following Brightspace Remote Plugin examples that implement the LTI [Content-Item Message (CIM)](https://www.imsglobal.org/specs/lticiv1p0) standard are available:
* [Insert Stuff (ISF) CIM](/docs/remoteplugins-cim.md)
* [Quicklink CIM](/docs/remoteplugins-cim.md)
* [Content Import CIM](/docs/remoteplugins-cim.md)

## External Links
* [Awards Leaderboard Sample Application](https://github.com/Brightspace/Awards-Leaderboard)
* [Brightspace APIs](http://docs.valence.desire2learn.com/reference.html)
* [Brightspace Community - Developer Discussions](https://community.brightspace.com/s/topic/0TO610000000JcwGAE/developer)
* [Brightspace Components](https://github.com/BrightspaceUI)
* [Brightspace UI](http://ui.developers.brightspace.com/)

## Contributing

Please read through our [contributing guidelines](CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.