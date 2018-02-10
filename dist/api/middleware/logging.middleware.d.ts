/// <reference types="express" />
import { BaseMiddleware } from "inversify-express-utils";
import * as express from 'express';
export declare class LoggingMiddleware extends BaseMiddleware {
    handler(req: express.Request, res: express.Response, next: express.NextFunction): void;
}
