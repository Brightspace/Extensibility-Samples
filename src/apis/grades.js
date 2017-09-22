'use strict';

const async = require('async');

module.exports = function (app, request, configs, appContext, helpers) {

    /* GET /finalgrades
    *  Returns final grades with user information for all users in the given org unit based on the orgUnitId
    *  passed in through the query parameters.
    */
    app.get('/finalgrades', function (req, res) {
        const orgUnitId = req.query.orgUnitId;
        const classlistApiPath = '/d2l/api/le/1.12/' + orgUnitId + '/classlist/';
        const accessToken = req.cookies[configs.cookieName].accessToken;
        let userId = '';
        let userKey = '';
        let userContext = null;

        if (accessToken) {
            console.log('Attempting to retrieve final grades using OAuth 2.0 authentication.');
            const classlistRoute = helpers.createUrl(classlistApiPath, configs);
            request
                .get( classlistRoute )
                .set('Authorization', `Bearer ${accessToken}`)
                .end(function(error, response) {
                    if (error) {
                        console.log('Error calling the who am I route', error);
                        return res.status(500).send({ error: error });
                    } else if(response.statusCode !== 200) {
                        return res.status(response.statusCode).send(response.error);
                    } else {
                        const users = JSON.parse(response.text);
                        fetchFinalGrades(orgUnitId, users, accessToken, userContext, res);
                    }
                });
        } else {
            console.log('Attempting to retrieve final grades using ID Key Authentication.');
            userId = req.cookies[configs.cookieName].userId;
            userKey = req.cookies[configs.cookieName].userKey;
            userContext = appContext.createUserContextWithValues(configs.instanceScheme + '//' + configs.instanceUrl, configs.instancePort, userId, userKey);
            const apiCallUrl = userContext.createAuthenticatedUrl(classlistApiPath, 'GET');
            request
                .get( apiCallUrl )
                .end(function(error, response) {
                    if (error) {
                        console.log('Error calling the who am I route', error);
                        res.status(500).send({ error: error });
                    } else if(response.statusCode !== 200) {
                        res.status(response.statusCode).send(response.error);
                    } else {
                        const users = JSON.parse(response.text);
                        fetchFinalGrades(orgUnitId, users, accessToken, userContext, res);
                    }
                });
        }
    });
    /* function fetchFinalGrades
    * This function is used to asynchronously call the final grades route for each user.
    */
    function fetchFinalGrades(orgUnitId, users, accessToken, userContext, res) {
        let finalGradeBlocks = [];
        const gradesApiPath = '/d2l/api/le/1.12/' + orgUnitId + '/grades/final/values/';
        async.each(
            users, 
            function(user, callback){
                if (accessToken) {
                    const gradesRoute = helpers.createUrl(gradesApiPath + user.Identifier, configs);
                    request
                        .get( gradesRoute )
                        .set('Authorization', `Bearer ${accessToken}`)
                        .end(function(error, response) {
                            if (error) {
                                console.log('Error calling the Final Grades route', error);
                                callback({message: 'Error calling the Final Grades Route'});
                            } else if(response.statusCode !== 200) {
                                if(response.statusCode === 404){
                                    finalGradeBlocks.push({ FinalGrade: {}, User: user });
                                    callback(null);
                                } else {
                                    callback(response.error);
                                }   
                            } else {
                                const finalGradeBlock = JSON.parse(response.text);
                                finalGradeBlocks.push({ FinalGrade: finalGradeBlock, User: user });
                                callback(null);
                            }
                        });
                } else {
                    const gradesRoute = userContext.createAuthenticatedUrl(gradesApiPath + user.Identifier, 'GET');
                    request
                        .get( gradesRoute )
                        .end(function(error, response) {
                            if (error) {
                                console.log('Error calling the Final Grades route', error);
                                callback({message: 'Error calling the Final Grades Route'});
                            } else if(response.statusCode !== 200) {
                                if(response.statusCode === 404){
                                    finalGradeBlocks.push({ FinalGrade: {}, User: user });
                                    callback(null);
                                } else {
                                    callback(response.error);
                                }   
                            } else {
                                const finalGradeBlock = JSON.parse(response.text);
                                finalGradeBlocks.push({ FinalGrade: finalGradeBlock, User: user });
                                callback(null);
                            }
                        });       
                }
            },
            function(err) {
                if (err) {
                    res.send({ error: err });
                } else {
                    res.send(JSON.stringify(finalGradeBlocks));
                }
            }
        );               
    }
};
