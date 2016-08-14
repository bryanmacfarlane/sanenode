
/// <reference path="typings/index.d.ts" />

import * as exp from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as routes from './routes';
import * as cm from './common';

export async function create() {
    var app: exp.Express = exp();

    // no view engines for an api server
    // TODO: hook up logger

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(exp.static(path.join(__dirname, 'public')));

    // -------------------------------------------------------
    // routes
    // -------------------------------------------------------
    await routes.setup(app);

    // -------------------------------------------------------
    // error handling
    // -------------------------------------------------------

    // forward routes not found to the error handler
    app.use((req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
        var err: cm.ApiError = new cm.ApiError('Not Found', cm.StatusCode.NotFound);
        next(err);
    });

    app.use((err: cm.ApiError, req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
        cm.handleError(err, res);
    });

    return app;
}

process.on('uncaughtException', function (err) {
    console.error(err.stack);
});
