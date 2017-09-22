module.exports = function (app, request, configs, appContext, path, directory, helpers) {



     /* GET /isfselection
    *  Returns the isf-cim html page for presentation to the user within Brightspace.
    */
    app.get('/isfselection', function(req, res) {
        res.sendFile(path.join(directory+'/html/isf-cim.html'));
    });

     /* POST /lti/isfcontent
    *  The LTI endpoint for a Insert Stuff (CIM) remote plugin.
    */
    app.post('/lti/isfcontent', function (req, res) {
        const url = req.protocol + '://' + req.get('host') + '/lti/isfcontent';
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
            res.redirect('/isfselection');      
        }
    });

     /* GET /getisfdetails
    *  Returns the details for the request that needs to be submitted through the form back
    *  to Brightspace in order to insert the stuff into Brightspace.
    */
    app.get('/getisfdetails', function (req, res) {
        const imageUrl = req.protocol + '://' + req.get('host') + '/content/isf/' + req.query.image;
        const contentItemReturnUrl = req.cookies['lti-request'].contentItemReturnUrl;

        const contentItems = {
            "@context" : "http://purl.imsglobal.org/ctx/lti/v1/ContentItem",
            "@graph": [
                {
                    "@type" : "ContentItem",
                    mediaType: 'image/png',
                    title: 'Brightspace Logo',
                    text: '',
                    url: imageUrl,
                    placementAdvice : {
                        displayWidth : 100,
                        displayHeight : 30,
                        presentationDocumentTarget : 'embed',
                        windowTarget : '_blank'
                    }
                }
            ]
        };
        
        let responseObject = {
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
