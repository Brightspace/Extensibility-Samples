module.exports = {
    applicationId: process.env.APPLICATION_ID || '',
    applicationKey: process.env.APPLICATION_KEY || '',
    authCodeScope: process.env.AUTH_SCOPE || 'core:*:*',
    authEndpoint: process.env.AUTH_ENDPOINT || 'https://auth.brightspace.com/oauth2/auth',
    clientId: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    configuredPort:  process.env.TOKEN_CONFIGURED_PORT || 34343,
    cookieName: process.env.COOKIE_NAME || 'sampleAppCokie',
    cookieOptions: { httpOnly: true, secure: true },
    instanceScheme: process.env.INSTANCE_SCHEME || 'https:',
    instancePort: process.env.INSTANCE_PORT || '443',
    instanceUrl: process.env.INSTANCE_URL || 'devcop.brightspace.com',
    state: process.env.STATE || 'ed9dda12-1397-4bac-aba2-096acc7d24f1',
    tokenEndpoint: process.env.TOKEN_ENDPOINT || 'https://auth.brightspace.com/core/connect/token'
};
