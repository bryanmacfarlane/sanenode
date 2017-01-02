/// <reference path="typings/index.d.ts" />

import * as express from 'express';
import * as cors from 'cors';
import * as cm from '../common/contracts';
import * as compm from './components/quotelabel';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as ReactServer from 'react-dom/server';

let router: express.Router = express.Router();

let data: any = {
    "quotecontents": "<h1>quote contents here</h1>"
};

//let config = require('./config.json');

export async function setup(app:express.Express) {
    //----------------------------------------------------------
    // CORS for Cross Domain Requests
    // https://staticapps.org/articles/cross-domain-requests-with-cors/
    //----------------------------------------------------------

    // enabling simple uses for all routes and all origins
    // production apps should set origin in options
    // see https://github.com/expressjs/cors
    app.use(cors());
    app.options('*', cors());

    //----------------------------------------------------------
    // Create Services
    //----------------------------------------------------------

    // TODO: create quote svc to manage requests to api server
    // let qsvc: qm.QuotesService = new qm.QuotesService();
    // await qsvc.initialize();

    //----------------------------------------------------------
    // Routes using Services
    //----------------------------------------------------------
    app.get('/', (req: express.Request, res: express.Response) => {
        let quote: cm.IQuote = <cm.IQuote>{};
        quote.quote = "This is a cool quote";
        quote.author = "Some dude";

        let el: React.ReactElement<cm.IQuote> = React.createElement(compm.QuoteLabel, quote);
        let contents:string = ReactServer.renderToString(el);

        res.render('index', {
            "quotecontents": contents
        });
    });

    app.get('/:view', (req: express.Request, res: express.Response) => {
        let viewName = req.params.view || 'index';
        res.render(viewName, data);
    });
}