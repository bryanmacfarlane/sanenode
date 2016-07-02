/// <reference path="typings/api.d.ts" />

import * as exp from 'express';
import * as jwt from 'jsonwebtoken';
import * as qm from './quotes';
import * as cm from './common';
import * as id from './identity';

export async function setup(app:exp.Express) {
    let idsvc: id.IdentityService = new id.IdentityService();
    await idsvc.initialize();

    let qsvc: qm.QuotesService = new qm.QuotesService();
    await qsvc.initialize();

    app.get('/', (req: exp.Request, res: exp.Response) => {
        res.send({ message: "quote service" });
    });
    
    app.post('/authtoken', async (req: exp.Request, res: exp.Response) => {
        try {
            let token: string;
            let cred: cm.IApiCredential = req.body;

            let identity: id.Identity = await idsvc.authenticate(cred);
            if (identity) {
                 token = jwt.sign(identity, "secret", <jwt.SignOptions>{ expiresIn: 24 * 60 });
            }
            else {
                res.status(cm.StatusCode.Unauthorized).send({ message: "Authentication Failed"});
            }
            
            identity['token'] = token;
            delete identity.credentials;
            res.send(identity);
        }
        catch (err) {
            cm.handleError(err, res);
        }
    });

    app.get('/quotes', async (req: exp.Request, res: exp.Response) => {
        var quotes: qm.IQuote[] = await qsvc.getQuotes();
        res.send(quotes);
    });

    app.get('/quotes/random', async (req: exp.Request, res: exp.Response) => {
        var quote: qm.IQuote = await qsvc.getRandomQuote();
        res.send(quote);
    });
}