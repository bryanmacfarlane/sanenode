import appm = require('./app');
import http = require('http');
import assert = require('assert');
import * as request from 'supertest';
import * as idm from './identity';
import * as qm from './quotes';
import * as cm from '../common/contracts';
import * as Q from 'q';

var _port = 8880;
var _app;
var _server: http.Server = null;

describe('Quotes API Tests', async () => {

    beforeEach(async (done) => {
        try {
            // start up the server in proc.  effectively what server.ts does
            // and is why that and app.ts are separated - for easy testing.
            async function startServer() {
                _app = await appm.create();
                _server = http.createServer(_app);
                _server.listen(_port, (err) => {
                    if (err) {
                        assert.fail('failed to listen', 'listen', 'Failed to start server: ' + err.message, 'server');
                    }

                    done();
                });
            }

            startServer();
        }
        catch (err) {
            assert.fail('no task lib', 'tasklib', 'Failed to load task lib: ' + err.message, 'tasklib');
        }
    });

    afterEach(function () {
        _server.close();
    });

    describe('Quote Service', () => {        
        it('returns 200 for /', async function (done) {
            this.timeout(1000);

            try {
                let res: request.Response = await get('/');
                assert.equal(res.status, 200, "should be 200");
                done();
            }
            catch (err) {
                done(err);
            }
        });

        it('returns 200 for /quotes/random', async function (done) {
            this.timeout(1000);
            try {
                let res: request.Response = await get('/quotes/random');
                assert.equal(res.status, 200, "should be 200");
                let quote: cm.IQuote = <cm.IQuote>res.body;
                assert(quote.quote.length > 0, 'has a quote');
                assert(quote.author.length > 0, 'has an author'); 
                done();
            }
            catch (err) {
                done(err);
            }
        });

        it('returns 404 /notexist', async function (done) {
            this.timeout(1000);

            try {
                let res: request.Response = await get('/notexist');
                assert.equal(res.status, 404, "should be 404");
                done();
            }
            catch (err) {
                done(err);
            }
        });

        it('authenticates with UserPass', async function (done) {
            this.timeout(1000);

            try {
                var identity: idm.Identity = await authenticate('johndoe', 'password');
                done(); 
            }
            catch (err) {
                done(err);
            }
        });

        it('returns 200 for authenticated /quotes', async function (done) {
            this.timeout(1000);
            try {
                var identity: idm.Identity = await authenticate('johndoe', 'password');
                assert(identity.token.length > 0, "should have token");

                let res: request.Response = await get('/quotes', identity.token);
                assert.equal(res.status, 200, "should be 200");
                done();
            }
            catch (err) {
                done(err);
            }
        });

        it('returns 403 for not authorized /quotes', async function (done) {
            this.timeout(1000);
            try {
                var identity: idm.Identity = await authenticate('janedoe', 'password');
                assert(identity.token.length > 0, "should have token");

                let res: request.Response = await get('/quotes', identity.token);
                assert.equal(res.status, 403, "should be 403");
                done();
            }
            catch (err) {
                done(err);
            }
        });                        
    })
});

//-------------------------------------------------------------------------------
// Test Utils
//-------------------------------------------------------------------------------
function authenticate(username: string, 
                    password: string): Q.Promise<idm.Identity> {
    var defer = Q.defer();

    var cred: cm.IApiCredential = { 
        "credentialtype": "UserPass", 
        "data": { 
            "username": username, 
            "password": password 
        } 
    };

    request(_app).post('/authtoken').set('Accept', 'application/json')
        .send(cred)
        .expect(200)
        .end((err, res: request.Response) => {
            if (err) {
                defer.reject(err); 
                return ; 
            }

            var identity: idm.Identity = res.body;
            defer.resolve(identity);
        });
    
    return <Q.Promise<idm.Identity>>defer.promise;

}

//
// Get return json object.  
// Call done if supplied.
// Add auth token if supplied
//
function get(path: string, token?: string): Q.Promise<request.Response> {
    var defer = Q.defer();

    var test: request.Test = request(_app)
        .get(path).set('Accept', 'application/json');
        
    if (token) {
        test = test.set('Authorization', 'Bearer ' + token);
    }
    
    test.expect('Content-Type', /json/)
    .end((err, res: request.Response) => {
        if (err) {
            defer.reject(err); 
        }
        else {
            defer.resolve(res);
        }
    });

    return <Q.Promise<any>>defer.promise;    
}
