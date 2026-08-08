const express = require('express');

function setupMiddleware(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}

module.exports = setupMiddleware;