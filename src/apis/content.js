module.exports = function (app, request, configs, appContext) {

    var fs = require('fs');
    var helpers = require('../helpers');

    /* GET /uploadhtmlcontent
    *  Uploads an HTML document to a module within the given course. The OrgUnitId and ModuleId are parameters
    *  passed in through the query parameters.
    */
    app.get('/uploadhtmlcontent', function (req, res) {

        var orgUnitId = req.query.orgUnitId;
        var moduleId = req.query.moduleId;
        var apiPath = '/d2l/api/le/1.22/' + orgUnitId + '/content/modules/' + moduleId + '/structure/';
        var accessToken = req.cookies[configs.cookieName].accessToken;
        var boundary = 'xxBOUNDARYxx';
        var topicData = {
            Title: "Sample HTML Content",
            ShortTitle: null,
            Type: 1,
            TopicType: 1,
            Url: "/content/enforced/6952-ES100/sample-content.html",
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
        var body = buildMultipartBody(boundary, topicData, './content/file-upload/sample-content.html', 'sample-content.html', 'text/html', 'utf8');  

        if (accessToken) {
            console.log('Attempting to make the Content Creation route call using OAuth 2.0 authentication.');
            var contentRoute = helpers.createUrl(apiPath, configs);
            request
                .post(contentRoute)
                .set('Authorization', `Bearer ${accessToken}`)
                .type('multipart/mixed;boundary=' + boundary)
                .send(body)
                .end(function(error, response) {
                    if (error) {
                        console.log("Error calling the upload content route", error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode != 200) {
                       res.status(response.statusCode).send(response.error);
                    } else {
                       res.status(200).send(response.text);
                    }
                });
        } else {
            console.log('Attempting to make the Content Creation route call using ID Key Authentication.');
            var userId = req.cookies[configs.cookieName].userId;
            var userKey = req.cookies[configs.cookieName].userKey;
            var userContext = appContext.createUserContextWithValues(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, userId, userKey);
            var apiCallUrl = userContext.createAuthenticatedUrl(apiPath, 'POST');
            request
                .post(apiCallUrl)
                .type('multipart/mixed;boundary=' + boundary)
                .send(body)
                .end(function(error, response) {
                    if (error) {
                        console.log("Error calling the upload content route", error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode != 200) {
                        res.status(response.statusCode).send(response.error);
                    } else {
                        res.status(200).send(response.text);
                    }
                });
        }

    });

    /* GET /uploadworddocument
    *  Uploads a Word document to a module within the given course. The OrgUnitId and ModuleId are parameters
    *  passed in through the query parameters.
    */
    app.get('/uploadworddocument', function (req, res) {

        var orgUnitId = req.query.orgUnitId;
        var moduleId = req.query.moduleId;
        var apiPath = '/d2l/api/le/1.22/' + orgUnitId + '/content/modules/' + moduleId + '/structure/';
        var accessToken = req.cookies[configs.cookieName].accessToken;
        var boundary = 'xxBOUNDARYxx';
        var topicData = {
            Title: "Sample Word Document Content",
            ShortTitle: null,
            Type: 1,
            TopicType: 1,
            Url: "/content/enforced/6952-ES100/sample-content.docx",
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

        var body = buildMultipartBody(boundary, topicData, './content/file-upload/sample-content.docx', 'sample-content.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        if (accessToken) {
            console.log('Attempting to make the Content Creation route call using OAuth 2.0 authentication.')
            var contentRoute = helpers.createUrl(apiPath, configs);
            request
                .post(contentRoute)
                .set('Authorization', `Bearer ${accessToken}`)
                .type('multipart/mixed;boundary=' + boundary)
                .query({base64: true})
                .send(body)
                .end(function(error, response) {
                    if (error) {
                        console.log("Error calling the upload content route", error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode != 200) {
                       res.status(response.statusCode).send(response.error);
                    } else {
                       res.status(200).send(response.text);
                    }
                });
        } 
        else {
            console.log('Attempting to make the Content Creation route call using ID Key Authentication.')
            var userId = req.cookies[configs.cookieName].userId;
            var userKey = req.cookies[configs.cookieName].userKey;
            userContext = appContext.createUserContextWithValues(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, userId, userKey);
            var apiCallUrl = userContext.createAuthenticatedUrl(apiPath, 'POST');
            request
                .post(apiCallUrl)
                .type('multipart/mixed;boundary=' + boundary)
                .query({base64: true})
                .send(body)
                .end(function(error, response) {
                    if (error) {
                        console.log("Error calling the upload content route", error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode != 200) {
                        res.status(response.statusCode).send(response.error);
                    } else {
                        res.status(200).send(response.text);
                    }
                });
        }

    });

    /* function buildMultipartBody
    * This function is used to build up the body for a multipart/mixed request.
    * If the file encoding is passed in then the file data is formated using base64 encoding
    * otherwise standard utf8 encoding is used.
    */
    function buildMultipartBody(boundary, jsonData, filePath, fileName, fileContentType, fileEncoding) {      
        var newLine = '\r\n';
        var doubleDashes = '--';
        var endBoundary = doubleDashes + boundary + doubleDashes + newLine;
        var startAndMiddleBoundary = doubleDashes + boundary + newLine; 

        var content = startAndMiddleBoundary;
        content += 'Content-Type: application/json' + newLine + newLine;
        content += JSON.stringify(jsonData) + newLine;
        content += startAndMiddleBoundary;
        content += 'Content-Disposition: form-data; name=""; filename="' + fileName + '"' + newLine;
        content += 'Content-Type: ' + fileContentType + newLine + newLine;
        var text = '';
        if (!fileEncoding) {
            text = fs.readFileSync(filePath).toString('base64'); 
        } else {
            text = fs.readFileSync(filePath,'utf8');
        }
        content += text + newLine;
        content += endBoundary;
        return content;
    }
};
