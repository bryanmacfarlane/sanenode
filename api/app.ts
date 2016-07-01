
/// <reference path="typings/api.d.ts" />

import * as exp from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as routes from './routes';

export async function create() {
    console.log('create');
    var app: exp.Express = exp();

    console.log('created exp');
    // no view engines for an api server
    // TODO: hook up logger

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(exp.static(path.join(__dirname, 'public')));

    // -------------------------------------------------------
    // routes
    // -------------------------------------------------------
    console.log('routes');
    await routes.setup(app);

    // -------------------------------------------------------
    // error handling
    // -------------------------------------------------------

    // error can have status on it
    interface Error {
        message: string,
        status?: number;
    }

    interface ApiError {
        message: string,
        error: Error
    }    

    // forward routes not found to the error handler
    app.use((req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
        var err: Error = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    var dev: boolean = app.get('env') === 'development';

    app.use((err: Error, req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
        res.status(err.status || 500);

        // dev includes full error object with stack trace etc
        var resErr = dev ? err : {};
        res.send(<ApiError>{ message: err.message, error: resErr });
    });

    return app;
}

process.on('uncaughtException', function (err) {
    console.error(err.stack);
});
