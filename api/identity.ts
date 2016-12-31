/// <reference path="typings/index.d.ts" />

import * as path from 'path';
import * as ds from 'nedb';
import * as sm from './store';
import * as Q from 'q';
import * as em from '../common/error';
import * as cm from '../common/contracts'

var sampleIdentities = require('./sampledata/identities.json');

export interface Identity {
    id: string,
    name: string,
    roles: string[];
    token?: string,
    credentials: { [credtype: string]: cm.IApiCredential };
}
    
export class IdentityService {
    constructor() {
        this._store = new sm.Store();
    }

    private _store: sm.Store;

    public async authenticate(credential: cm.IApiCredential): Promise<Identity> {
        var identity: Identity;

        if (!credential.credentialtype || !credential.data ) {
            throw new Error('Invalid credential');
        }

        // sample only supports UserPass cred
        if (credential.credentialtype !== "UserPass") {
            throw new Error('Unsupported credential type: ' + credential.credentialtype);
        }

        let username: string = credential.data["username"];
        var candidate: Identity = await this._store.findOne<Identity>({ "id": username });

        if (candidate) {
            let candidateCred: cm.IApiCredential = candidate.credentials[credential.credentialtype];

            if (candidateCred) {
                var password: string = credential.data["password"];

                var candPass: string = candidate.credentials[credential.credentialtype].data["password"];
                if (password === candPass) {
                    identity = candidate;
                }
            }

            // bad credentials isn't exceptional.
            // we successfully determined creds are bad.  identity is null in those cases.
        }
        
        return identity;
    }

    public isInRole(identity: Identity, role: string) {
        let inRole: Boolean = false;

        if (identity.roles) {
            inRole = identity.roles.indexOf(role) >= 0;
        }
        
        return inRole;
    }    

    public async initialize() {
        // insert some sample data for the demo
        let sampleIdentity: Identity;

        sampleIdentities.forEach(async (sampleIdentity) => {
            await this._store.insert<Identity>(sampleIdentity);
        });
    }
}