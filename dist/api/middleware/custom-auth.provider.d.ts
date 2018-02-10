/// <reference types="express" />
import { interfaces } from 'inversify-express-utils';
import * as express from 'express';
export declare class CustomAuthProvider implements interfaces.AuthProvider {
    private readonly _authService;
    getUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<interfaces.Principal>;
}
