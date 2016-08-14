/// <reference path="typings/index.d.ts" />

import * as exp from 'express';
import * as jwt from 'jsonwebtoken';
import * as Q from 'q';
import * as cm from './common';
import * as secm from './security';
import * as idm from './identity';

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
                        decoded = await Q.nfcall(jwt.verify, parts[1], cm.JWT_SECRET);
                    }
                }
            }
            catch (err) {}

            if (decoded) {
                req['identity']=decoded;
                next();
            }
            else {
                var err: cm.ApiError = new cm.ApiError('Unauthorized', 401);
                res.status(cm.StatusCode.Unauthorized).send(err);
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
                var err: cm.ApiError = new cm.ApiError('Access Denied', 403);
                res.status(cm.StatusCode.Forbidden).send(err);
            }
        });        
    }
} 
