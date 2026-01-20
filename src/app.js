const path = require('path');
const express = require('express');
const app = express();
const configViewEngine = require('./config/viewEngine.js');
const configStaticFile = require('./config/staticFile.js');
const webRouter = require('./routes/web.js');
const configSession = require('./config/session.js');
const { errorHandler, errorConverter } = require('./middleware/error.js');

//config session
configSession(app);

//config app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// make environment available to views
app.locals.PUBLIC_ENV = {
    NODE_ENV: process.env.NODE_ENV
}

configViewEngine(app);
configStaticFile(app);

app.use('/', webRouter);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'Invalid JSON format',
            message: err.message
        });
    }
    next(err);
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;