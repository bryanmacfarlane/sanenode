/// <reference path="typings/index.d.ts" />

import * as exp from 'express';
import * as jwt from 'jsonwebtoken';
import * as Q from 'q';
import * as qm from './quotes';
import * as cm from './common';
import * as id from './identity';
import * as auth from './authrouter';
import * as cors from 'cors';

// should come from config
const JWT_SECRET: string = "secret";

export async function setup(app:exp.Express) {
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
    let idsvc: id.IdentityService = new id.IdentityService();
    await idsvc.initialize();

    let qsvc: qm.QuotesService = new qm.QuotesService();
    await qsvc.initialize();

    //----------------------------------------------------------
    // Routes using Services
    //----------------------------------------------------------
    app.get('/', (req: exp.Request, res: exp.Response) => {
        res.send({ message: "quote service" });
    });

    app.post('/authtoken', async (req: exp.Request, res: exp.Response) => {
        try {
            let token: string;
            let cred: cm.IApiCredential = req.body;

            let identity: id.Identity = await idsvc.authenticate(cred);
            if (identity) {
                delete identity.credentials;
                token = jwt.sign(identity, JWT_SECRET, <jwt.SignOptions>{ expiresIn: 24 * 60 });
            }
            else {
                res.status(cm.StatusCode.Unauthorized).send({ message: "Authentication Failed"});
            }
            
            identity['token'] = token;
            res.send(identity);
        }
        catch (err) {
            cm.handleError(err, res);
        }
    });

    //
    // Anonymous Routes
    //
    app.get('/quotes/random', async (req: exp.Request, res: exp.Response) => {
        var quote: qm.IQuote = await qsvc.getRandomQuote();
        res.send(quote);
    });

    //
    // Protected Routes
    //

    // dumping all quotes is for admin quote management UI - auth and check permission.
    app.get('/quotes', 
            new auth.AuthRouter().permission('list_quotes').router, 
            async (req: exp.Request, res: exp.Response) => {

        let quotes: qm.IQuote[] = await qsvc.getQuotes();
        res.send(quotes);
    });
}