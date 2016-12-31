import * as exp from 'express';

export class StatusCode {
    public static ResourceMoved = 302;
    public static BadRequest = 400;
    public static Unauthorized = 401;
    public static Forbidden = 403;
    public static NotFound = 404;
    public static Conflict = 409;
    public static ServerError = 500;
}