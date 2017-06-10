import * as path from 'path';
import * as nedb from 'nedb';
import * as Q from 'q';

export class Store {
    constructor() {
        // in memory db
        this._db = new nedb();
    }

    private _db: nedb;

    public load(): Q.Promise<void> {
        return Q.ninvoke<void>(this._db, 'loadDatabase');
    }

    public find<T>(query:any): Q.Promise<Array<T>> {
        return Q.ninvoke<Array<T>>(this._db, 'find', query);
    }

    public findOne<T>(query:any): Q.Promise<T> {
        return Q.ninvoke<T>(this._db, 'findOne', query);
    }    

    public insert<T>(doc: T): Q.Promise<T> {
        return Q.ninvoke<T>(this._db, 'insert', doc);
    }
}