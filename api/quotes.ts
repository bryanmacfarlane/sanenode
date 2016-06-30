/// <reference path="typings/api.d.ts" />

import * as path from 'path';
import * as ds from 'nedb';
import * as sm from './store';
import * as Q from 'q';

export interface IQuote {
    quote: string,
    author: string
}

export class Quotes {
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

    public async getQuotes() {
        return await this._store.find<IQuote>({});
    }
}