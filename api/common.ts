/// <reference path="typings/api.d.ts" />

import * as exp from 'express';

// would typically come from runtime config in prod app.  shhh.
export var JWT_SECRET="secret";

export interface IStringDictionary { [name: string]: string }

export interface IApiCredential {
    credentialtype: string,
    data: IStringDictionary
}

export function handleError(err: Error, res: exp.Response) {
    if (err instanceof ApiError) {
        res.status(err.status).send(err);
    }
    else {
        res.status(StatusCode.ServerError).send(err);
    }
}

export class StatusCode {
    public static ResourceMoved = 302;
    public static BadRequest = 400;
    public static Unauthorized = 401;
    public static Forbidden = 403;
    public static NotFound = 404;
    public static Conflict = 409;
    public static ServerError = 500;
}

export class ApiError implements Error {
    constructor(message: string, status?: number) { 
        this.message = message; 
        if (!status) {
            status = StatusCode.ServerError;
        }
    }

    public name = "ApiError";
    public message: string;
    public status: number;

    public setStatus(status: number) {
        this.status = status;
    }
}

export class BadRequest extends ApiError {
    constructor(message: string) {
        super(message);
        this.status = StatusCode.BadRequest;
    }
}
