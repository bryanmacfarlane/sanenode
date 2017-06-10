import * as path from 'path';
import * as ds from 'nedb';
import * as sm from './store';
import * as Q from 'q';
import * as cm from '../common/contracts';

var sampleQuotes = require('./sampledata/quotes.json');
    
export class QuotesService {
    constructor() {
        this._store = new sm.Store();
    }

    private _store: sm.Store;

    public async initialize() {
        // insert some sample data for the demo
        let sampleQuote: cm.IQuote;

        sampleQuotes.forEach(async (sampleQuote) => {
            await this._store.insert<cm.IQuote>(sampleQuote);
        });
    }

    public async getQuotes(): Promise<cm.IQuote[]> {
        // await allows us to write linear code.  
        // makes it easy to also call async code in a loop
        // offers easy error handling with try catch
        var quotes: cm.IQuote[];
        var tries: number = 0;
        while (true) {
            try {
                ++tries;
                // ASYNC/AWAIT
                quotes = await this._store.find<cm.IQuote>({});
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
        var quote:cm.IQuote = null;
        var quotes = await this.getQuotes();
        var count: number = quotes.length;
        if (count > 0) {
            var randIndex: number = Math.floor(Math.random() * count);
            quote = quotes[randIndex];
        }
        return quote; 
    }    
}