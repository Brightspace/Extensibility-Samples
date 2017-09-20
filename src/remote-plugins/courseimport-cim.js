module.exports = function (app, request, configs, appContext, path, directory) {

    var helpers = require('../helpers');

    /* GET /courseimportselection
    *  Returns the courseimport-cim html page for presentation to the user within Brightspace.
    */
    app.get('/courseimportselection', function(req, res) {
        res.sendFile(path.join(directory+'/html/courseimport-cim.html'));
    });

    /* POST /lti/isfcontent
    *  The LTI endpoint for a Course Import (CIM) remote plugin.
    */
    app.post('/lti/courseimport', function (req, res) {
        var url = req.protocol + '://' + req.get('host') + '/lti/courseimport';
        if (!helpers.verifyLtiRequest(url, req.body, configs.ltiSecret)) {
            console.log('Could not verify the LTI Request. OAuth 1.0 Validation Failed');
            res.status(500).send({error: 'Could not verify the LTI Request. OAuth 1.0 Validation Failed'});
        } else {
            res.cookie('lti-request', { 
                contentItemReturnUrl: req.body.content_item_return_url,
                oauth_version: req.body.oauth_version,
                oauth_nonce: req.body.oauth_nonce,
                oauth_consumer_key: req.body.oauth_consumer_key,
                oauth_callback: req.body.oauth_callback,
                oauth_signature_method: req.body.oauth_signature_method
            }, configs.cookieOptions);
            res.redirect('/courseimportselection');      
        }
    });

    /* GET /getcourseimportdetails
    *  Returns the details for the request that needs to be submitted through the form back
    *  to Brightspace in order to import the selected package into Brightspace.
    */
    app.get('/getcourseimportdetails', function (req, res) {
        // Generate the url to the package based on the user's selection, sent through the query param named
        // package.
        var fileUrl = req.protocol + '://' + req.get('host') + '/content/importpackage/' + req.query.package;
        var contentItemReturnUrl = req.cookies['lti-request'].contentItemReturnUrl;

        var contentItems = {
            "@context" : "http://purl.imsglobal.org/ctx/lti/v1/ContentItem",
            "@graph": [
                {
                    "@type" : "FileItem",
                    mediaType: 'application/vnd.d2l.coursepackage1p0',
                    title: req.query.package,
                    text: 'Brightspace sample course package to import.',
                    url: fileUrl
                }
            ]
        };
        
        var responseObject = {
            lti_message_type: 'ContentItemSelection',
            lti_version: 'LTI-1p0',
            content_items: JSON.stringify(contentItems),
            oauth_version: req.cookies['lti-request'].oauth_version,
            oauth_nonce: req.cookies['lti-request'].oauth_nonce,
            oauth_timestamp: helpers.getUnixTimestamp(),
            oauth_consumer_key: req.cookies['lti-request'].oauth_consumer_key,
            oauth_callback: req.cookies['lti-request'].oauth_callback,
            oauth_signature_method: req.cookies['lti-request'].oauth_signature_method
        };
        responseObject.oauth_signature = helpers.generateAuthSignature(contentItemReturnUrl, responseObject, configs.ltiSecret);
        responseObject.lti_return_url = contentItemReturnUrl;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(responseObject));        
    });

};
