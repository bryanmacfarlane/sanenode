/// <reference path="typings/api.d.ts" />

import * as exp from 'express';
import * as qm from './quotes';

export async function setup(app:exp.Express) {
    var qsvc: qm.Quotes = new qm.Quotes();
    await qsvc.initialize();

    app.get('/', (req: exp.Request, res: exp.Response) => {
        res.send({ message: "quote service" });
    })
    
    app.get('/quotes', async (req: exp.Request, res: exp.Response) => {
        var quotes: qm.IQuote[] = await qsvc.getQuotes();
        res.send(quotes);
    });

    app.get('/quotes/random', async (req: exp.Request, res: exp.Response) => {
        var quote: qm.IQuote = await qsvc.getRandomQuote();
        res.send(quote);
    });
}