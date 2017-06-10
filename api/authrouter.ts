import * as exp from 'express';
import * as jwt from 'jsonwebtoken';
import * as Q from 'q';
import * as api from './common';
import * as secm from './security';
import * as idm from './identity';

let config = require('./config.json');

//
// Authentication and Authorization Router Middleware
// Use middleware pipeline for Bearer token authenticaion and
// authorization permission/role checks
//
export class AuthRouter {
    constructor() {
        this.router = exp.Router();
        this._secSvc = secm.getSecurityService();
        this.setup();
    }

    private _permission: string;
    private _secSvc: secm.SecurityService;
    public router: exp.Router;

    // chaining
    public permission(permission: string): AuthRouter {
        this._permission = permission;
        return this;
    }

    private setup(): void {
        // authenticate with bearer token
        this.router.use( async (req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
            let decoded: any;

            try {
                let auth: string = req.headers['authorization'];
                if (auth) {
                    let parts = auth.trim().split(' ');
                    if (parts.length == 2 && parts[0] === 'Bearer') {
                        decoded = await Q.nfcall(jwt.verify, parts[1], config.JWT_SECRET);
                    }
                }
            }
            catch (err) {}

            if (decoded) {
                req['identity']=decoded;
                next();
            }
            else {
                res.status(api.StatusCode.Unauthorized).send(new Error('Unauthorized'));
            }
        });

        // authorize permission for identities roles
        this.router.use( async (req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
            let hasPermission: Boolean = false;
            let identity: idm.Identity = <idm.Identity>req['identity'];
            if (identity) {
                hasPermission = await this._secSvc.identyHasPermission(req['identity'], this._permission);
            }
            
            if (hasPermission) {
                next();
            }
            else {
                res.status(api.StatusCode.Forbidden).send(new Error('Access Denied'));
            }
        });        
    }
} 
