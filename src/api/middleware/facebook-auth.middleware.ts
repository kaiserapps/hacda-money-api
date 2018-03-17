import * as express from 'express';
import { inject, injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import * as passport from 'passport';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';

@injectable()
export class FacebookAuthMiddleware extends BaseMiddleware {
    @inject(TYPES.Environment) private readonly _environment: IEnvironment;
    public handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (this._environment.facebookClientId && this._environment.facebookClientSecret) {
            return passport.authenticate('facebook', {
                failureRedirect: `${req.protocol}://${this._environment.clientUrl}/auth/failure`,
                scope: ['email']
            })(req, res, next);
        }
        else {
            res.status(500).json({ error: 'Facebook Auth is missing or configured incorrectly.' });
        }
    }
}
