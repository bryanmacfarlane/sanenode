
/// <reference path="typings/api.d.ts" />

import exp = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import qm = require('./quotes');

export async function create() {
    console.log('create');
    var app: exp.Express = exp();

    console.log('created exp');
    // no view engines for an api server
    // TODO: hook up logger
    var qsvc: qm.Quotes = new qm.Quotes();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(exp.static(path.join(__dirname, 'public')));

    // routes
    console.log('routes');
    app.get('/', (req: exp.Request, res: exp.Response) => {
        res.send({ message: "quote service" });
    })
    
    app.get('/quotes', async (req: exp.Request, res: exp.Response) => {
        var quotes: qm.IQuote[] = await qsvc.getQuotes();
        res.send(quotes);
    });

    app.get('/quotes/random', async (req: exp.Request, res: exp.Response) => {
        // await allows us to write linear code.  
        // quotes.length will note run until getQuotes async call returns
        // makes it easy to also call async code in a loop
        // offers easy error handling with try catch
        var tries: number = 0;
        while (true) {
            try {
                ++tries;
                // ASYNC/AWAIT
                var quotes: qm.IQuote[] = await qsvc.getQuotes();
                var count: number = quotes.length;
                if (count > 0) {
                    var randIndex: number = Math.floor(Math.random() * count);
                    var quote = quotes[randIndex];
                    res.send(quote);
                }
                else {
                    res.status(404).send({ message: 'no quotes to pick from'});
                }
                break;
            }
            catch (err) {
                if (tries == 3) { throw err; }
                console.log('Retrying ...');
            }
        }
    });    

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

    console.log('init quote service');
    await qsvc.initialize();

    return app;
}

process.on('uncaughtException', function (err) {
    console.error(err.stack);
});
