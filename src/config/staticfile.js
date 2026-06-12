const path = require('path');
const express = require('express');
require('dotenv').config();
const configStaticfile = (app) => {
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // static file for development

    if (process.env.NODE_ENV === 'development') {
        app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));
    }
}

module.exports = configStaticfile;
