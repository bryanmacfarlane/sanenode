/// <reference path="typings/api.d.ts" />

import * as path from 'path';
import * as Q from 'q';
import * as idsvc from './identity';

export interface IRole {
    name: string,
    permissions: string[];
}

export interface IRoles { [id: string]: IRole }

// make sure we have one instance of security service in memory.  node modules are cached
var securityService: SecurityService = null;
export function getSecurityService(): SecurityService {
    if (!securityService) {
        securityService = new SecurityService();
    }
    return securityService;
}

export class SecurityService {
    constructor() {
        // would come from db in real app
        this._roles = require('./sampledata/roles.json');
        this._roleIds = Object.keys(this._roles);
    }

    private _roles: IRoles;
    private _roleIds: string[];

    public async identyHasPermission(identity: idsvc.Identity, permission: string): Promise<Boolean> {
        let hasPerm: boolean = false;

        // sample - real app would optimize with O(1) cache lookups etc...
        for (var i = 0; i < this._roleIds.length; i++) {
            let currRoleId: string = this._roleIds[i];
            if (identity.roles.indexOf(currRoleId) >= 0) {
                let role: IRole = this._roles[currRoleId];
                if (role && role.permissions.indexOf(permission) >= 0) {
                    hasPerm = true;
                    break;
                }
            }          
        } 

        return hasPerm;
    }
}
