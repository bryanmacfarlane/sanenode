/// <reference path="typings/api.d.ts" />

import * as path from 'path';
import * as ds from 'nedb';
import * as sm from './store';
import * as Q from 'q';

export interface IQuote {
    quote: string,
    author: string
}
    
export class QuotesService {
    constructor() {
        this._store = new sm.Store();
    }

    private _store: sm.Store;

    public async initialize() {
        // insert some sample data for the demo

        await this._store.insert<IQuote>(<IQuote>{ 
            "quote": "Don't cry because it's over, smile because it happened.",
            "author": "Dr. Seuss"}
        );

        await this._store.insert<IQuote>(<IQuote>{ 
            "quote": "Be yourself; everyone else is already taken.",
            "author": "Oscar Wilde"}
        );
    }

    public async getQuotes(): Promise<IQuote[]> {
        // await allows us to write linear code.  
        // makes it easy to also call async code in a loop
        // offers easy error handling with try catch
        var quotes: IQuote[];
        var tries: number = 0;
        while (true) {
            try {
                ++tries;
                // ASYNC/AWAIT
                quotes = await this._store.find<IQuote>({});
                break;
            }
            catch (err) {
                if (tries == 3) { throw err; }
                console.log('Retrying ...');
            }
        }

        return quotes;
    }

    public async getRandomQuote() {
        var quote:IQuote = null;
        var quotes = await this.getQuotes();
        var count: number = quotes.length;
        if (count > 0) {
            var randIndex: number = Math.floor(Math.random() * count);
            quote = quotes[randIndex];
        }
        return quote; 
    }    
}