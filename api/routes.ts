/// <reference path="typings/api.d.ts" />

import * as exp from 'express';
import * as jwt from 'jsonwebtoken';
import * as Q from 'q';
import * as qm from './quotes';
import * as cm from './common';
import * as id from './identity';

// should come from config
const JWT_SECRET: string = "secret";

export async function setup(app:exp.Express) {
    let idsvc: id.IdentityService = new id.IdentityService();
    await idsvc.initialize();

    let qsvc: qm.QuotesService = new qm.QuotesService();
    await qsvc.initialize();

    let authRouter: exp.Router = exp.Router();
    authRouter.use( async (req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
        let decoded: any;

        try {
            let token: string = req.headers['x-access-token'];
            if (token) {
                decoded = await Q.nfcall(jwt.verify, token, JWT_SECRET);
            }
        }
        catch (err) {
            // nothing - if it fails to verify, it won't be decoded
        }

        if (decoded) {
            req['identity']=decoded;
            next();
        }
        else {
            res.status(cm.StatusCode.Unauthorized).send("Unauthorized");
        }
    });

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

    // not authenticated
    app.get('/quotes/random', async (req: exp.Request, res: exp.Response) => {
        var quote: qm.IQuote = await qsvc.getRandomQuote();
        res.send(quote);
    });

    // authenticated to get all quotes dumped
    app.get('/quotes', authRouter, async (req: exp.Request, res: exp.Response) => {

        // hacky authorization - john doe yes, others no
        let identity: id.Identity = req['identity'];
        if (identity.id === 'johndoe') {
            var quotes: qm.IQuote[] = await qsvc.getQuotes();
            res.send(quotes);
        }
        else {
            res.status(cm.StatusCode.Forbidden).send({ message: "unauthorized"});
        }
    });
}