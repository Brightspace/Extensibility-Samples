'use strict';

const fs = require('fs'),
      configs = require('../configurations'),
      helpers = require('../helpers'),
      request = require('superagent'),
      express = require('express'),
      router = express.Router();

module.exports = function (appContext) {

    /* GET /uploadhtmlcontent
    *  Uploads an HTML document to a module within the given course. The OrgUnitId and ModuleId are parameters
    *  passed in through the query parameters.
    */
    router.get('/uploadhtmlcontent', function (req, res) {

        const orgUnitId = req.query.orgUnitId;
        const moduleId = req.query.moduleId;
        const apiPath = '/d2l/api/le/1.22/' + orgUnitId + '/content/modules/' + moduleId + '/structure/';
        const accessToken = req.cookies[configs.cookieName].accessToken;
        const boundary = 'xxBOUNDARYxx';
        const topicData = {
            Title: 'Sample HTML Content',
            ShortTitle: null,
            Type: 1,
            TopicType: 1,
            Url: '/content/enforced/6952-ES100/sample-content.html',
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
        const body = buildMultipartBody(boundary, topicData, './content/file-upload/sample-content.html', 'sample-content.html', 'text/html', 'utf8');  

        if (accessToken) {
            console.log('Attempting to upload content using OAuth 2.0 authentication.');
            const contentRoute = helpers.createUrl(apiPath, configs);
            request
                .post(contentRoute)
                .set('Authorization', `Bearer ${accessToken}`)
                .type('multipart/mixed;boundary=' + boundary)
                .send(body)
                .end(function(error, response) {
                    if (error) {
                        console.log('Error calling the upload content route', error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode !== 200) {
                       res.status(response.statusCode).send(response.error);
                    } else {
                       res.status(200).send(response.text);
                    }
                });
        } else {
            console.log('Attempting to upload content using ID Key Authentication.');
            const userId = req.cookies[configs.cookieName].userId;
            const userKey = req.cookies[configs.cookieName].userKey;
            const userContext = appContext.createUserContextWithValues(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, userId, userKey);
            const apiCallUrl = userContext.createAuthenticatedUrl(apiPath, 'POST');
            request
                .post(apiCallUrl)
                .type('multipart/mixed;boundary=' + boundary)
                .send(body)
                .end(function(error, response) {
                    if (error) {
                        console.log('Error calling the upload content route', error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode !== 200) {
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
    router.get('/uploadworddocument', function (req, res) {

        const orgUnitId = req.query.orgUnitId;
        const moduleId = req.query.moduleId;
        const apiPath = '/d2l/api/le/1.22/' + orgUnitId + '/content/modules/' + moduleId + '/structure/';
        const accessToken = req.cookies[configs.cookieName].accessToken;
        const boundary = 'xxBOUNDARYxx';
        const topicData = {
            Title: 'Sample Word Document Content',
            ShortTitle: null,
            Type: 1,
            TopicType: 1,
            Url: '/content/enforced/6952-ES100/sample-content.docx',
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

        const body = buildMultipartBody(boundary, topicData, './content/file-upload/sample-content.docx', 'sample-content.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        if (accessToken) {
            console.log('Attempting to make the Content Creation route call using OAuth 2.0 authentication.');
            const contentRoute = helpers.createUrl(apiPath, configs);
            request
                .post(contentRoute)
                .set('Authorization', `Bearer ${accessToken}`)
                .type('multipart/mixed;boundary=' + boundary)
                .query({base64: true})
                .send(body)
                .end(function(error, response) {
                    if (error) {
                        console.log('Error calling the upload content route', error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode !== 200) {
                       res.status(response.statusCode).send(response.error);
                    } else {
                       res.status(200).send(response.text);
                    }
                });
        } 
        else {
            console.log('Attempting to make the Content Creation route call using ID Key Authentication.');
            const userId = req.cookies[configs.cookieName].userId;
            const userKey = req.cookies[configs.cookieName].userKey;
            const userContext = appContext.createUserContextWithValues(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, userId, userKey);
            const apiCallUrl = userContext.createAuthenticatedUrl(apiPath, 'POST');
            request
                .post(apiCallUrl)
                .type('multipart/mixed;boundary=' + boundary)
                .query({base64: true})
                .send(body)
                .end(function(error, response) {
                    if (error) {
                        console.log('Error calling the upload content route', error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode !== 200) {
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
        const newLine = '\r\n';
        const doubleDashes = '--';
        const endBoundary = doubleDashes + boundary + doubleDashes + newLine;
        const startAndMiddleBoundary = doubleDashes + boundary + newLine; 

        let content = startAndMiddleBoundary;
        content += 'Content-Type: application/json' + newLine + newLine;
        content += JSON.stringify(jsonData) + newLine;
        content += startAndMiddleBoundary;
        content += 'Content-Disposition: form-data; name=""; filename="' + fileName + '"' + newLine;
        content += 'Content-Type: ' + fileContentType + newLine + newLine;

        const text = fileEncoding ? 
            fs.readFileSync(filePath,'base64') : 
            fs.readFileSync(filePath).toString('utf8');

        content += text + newLine;
        content += endBoundary;
        return content;
    }

    return router;
};
