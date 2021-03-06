'use strict';

const express = require('express');

module.exports = function (app, rootDirectory) {
    // Setup static folders for serving up content to the Remote Plugins.
    app.use('/content/isf', express.static(rootDirectory + '/content/isf'));
    app.use('/content/quicklink', express.static(rootDirectory + '/content/quicklink'));
};