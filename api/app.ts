
/// <reference path="typings/api.d.ts" />

import exp = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');

export function createApplication(): exp.Express {
    var app: exp.Express = exp();

    // no view engines for an api server
    // TODO: hook up logger

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(exp.static(path.join(__dirname, 'public')));

    // routes
    app.get('/', (req: exp.Request, res: exp.Response) => {
        res.send({ message: "say something" });
    })

    app.get('/hello', (req: exp.Request, res: exp.Response) => {
        res.send({ message: "hello world" });
    })

    // -------------------------------------------------------
    // error handling
    // -------------------------------------------------------

    // error can have status on it
    interface Error {
        message: string,
        status?: number;
    }

    // forward routes not found to the error handler
    app.use((req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
        var err: Error = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    interface ApiError {
        message: string,
        error: Error
    }

    var dev: boolean = app.get('env') === 'development';

    app.use((err: Error, req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
        res.status(err.status || 500);

        // dev includes full error object with stack trace etc
        var resErr = dev ? err : {};
        res.send(<ApiError>{ message: err.message, error: resErr });
    });

    return app;
}
