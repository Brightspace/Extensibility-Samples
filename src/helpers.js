'use strict';

const crypto = require('crypto');

module.exports = {

    /* function createUrl
    * This function is used to generate a fully qualified url to the configured instance.
    * Used when creating URL's for API requests that use the OAuth 2.0 authentication method.
    */
    createUrl: function(apiRoute, configs){
        return configs.instanceScheme + '//' + configs.instanceUrl + ':' + configs.instancePort + apiRoute;
    },

    /* function generateAuthSignature
    * This function is used to generate an OAuth 1.0 signature
    *
    *    Note: currently no query parameters are being passed in, but if that was to change
    *          we would have to add those parameters to the signatureBaseString in the same manner
    *          as the request body parameters.
    *
    */
    generateAuthSignature: function(url, requestBody, secret) {
        let signatureBaseString = 'POST&' + encodeURIComponent(url) + '&';
        let first = true;

        for (const key of Object.keys(requestBody).sort()) {
            if( key === 'oauth_signature' ){
                continue;
            }
            if (!first){
                signatureBaseString += encodeURIComponent('&' + key + '=' + encodeURIComponent(requestBody[key]));
            } else {
                signatureBaseString += encodeURIComponent(key + '=' + encodeURIComponent(requestBody[key]));
                first = false;
            }
        }
        signatureBaseString = signatureBaseString
            .replace(/\!/g, '%2521')
            .replace(/\*/g, '%252A')
            .replace(/'/g, '%2527')
            .replace(/\(/g, '%2528')
            .replace(/\)/g, '%2529')
            .replace(/%5B/g, '%255B')
            .replace(/%40/g, '%2540')
            .replace(/%5D/g, '%255D');
        
        const computedSignature = crypto.createHmac('sha1', secret + '&').update(signatureBaseString).digest('base64');
        return computedSignature;
    },

    /* verifyLtiRequest
    *    This method verifies the incoming LTI request from the Learning Environment.
    *    The LTI request is signed using OAuth 1.0, so to validate that it came from
    *    an authorized source we can reconstruct the oauth_signature and compare to 
    *    the passed in oauth signature using the LTI Secret as our key for the HMAC-SHA1
    *    hash.
    */  
    verifyLtiRequest: function(url, requestBody, secret) {
        const computedSignature = this.generateAuthSignature(url, requestBody, secret);
        return requestBody.oauth_signature === computedSignature;
    },

    /* function getUnixTimestamp
    * Used to generate a unix timestamp used in the signing of LTI responses in the temote plugin examples.
    */
    getUnixTimestamp: function() {
        const unix = Math.round(+new Date()/1000);
        return unix;
    },

    getRedirectUri: function(req) {
        return req.protocol + '://' + req.headers.host + '/oauthcallback';
    },

    getIdKeyRedirectUri: function(req) {
        return req.protocol + '://' + req.headers.host + '/idkeycallback';
    }
}; 
