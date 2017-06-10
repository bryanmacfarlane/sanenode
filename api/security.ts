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
        this._permMap = {};

        // create permission to roles map lookup
        this._roleIds.forEach((roleId: string) => {
            this._roles[roleId].permissions.forEach((perm: string) => {
                if (!this._permMap[perm]) { 
                    this._permMap[perm] = []; 
                }
                this._permMap[perm].push(roleId);
            })
        });
    }

    private _roles: IRoles;
    private _roleIds: string[];
    private _permMap: { [perm: string]: string[] }

    public async identyHasPermission(identity: idsvc.Identity, permission: string): Promise<Boolean> {
        let hasPerm: boolean = false;

        // find roles that have this permission then check if identity is in one of those roles
        let roleIds = this._permMap[permission];
        for (var i = 0; i < roleIds.length; i++) {
            if (identity.roles.indexOf(roleIds[i]) >= 0) {
                hasPerm = true;
                break;
            }
        }
        
        return hasPerm;
    }
}
