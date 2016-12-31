/// <reference path="typings/index.d.ts" />

import * as express from 'express';
import * as cors from 'cors';

let router: express.Router = express.Router();

let data: any = {
    "sample": "data"
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
        res.render('index', data);
    });

    app.get('/:view', (req: express.Request, res: express.Response) => {
        let viewName = req.params.view || 'index';
        res.render(viewName, data);
    });
}