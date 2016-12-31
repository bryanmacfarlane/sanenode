
/// <reference path="typings/index.d.ts" />

import * as exp from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as routes from './routes';
import * as em from '../common/error';
import * as api from './common'

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

    // routes not matched will fall through to this (404)
    app.use((req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
        res.status(404).send(new Error('Not Found'));
        //var err: em.QuoteError = new em.QuoteError('Not Found', em.StatusCode.NotFound);
        //next(err);
    });

    app.use((err: Error, req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
        res.status(500).send(err);
        //api.handleError(err, res);
    });

    return app;
}

process.on('uncaughtException', function (err) {
    console.error(err.stack);
});
