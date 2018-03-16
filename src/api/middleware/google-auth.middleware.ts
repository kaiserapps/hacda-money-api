import * as express from 'express';
import { inject, injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import * as passport from 'passport';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';

@injectable()
export class GoogleAuthMiddleware extends BaseMiddleware {
    @inject(TYPES.Environment) private readonly environment: IEnvironment;
    public handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (this.environment.googleClientId && this.environment.googleClientSecret) {
            return passport.authenticate('google', {
                failureRedirect: `${req.protocol}://${this.environment.clientUrl}/auth/failure`
            })(req, res, next);
        }
        else {
            res.sendStatus(500).json({ error: 'Google Auth is missing or configured incorrectly.' });
        }
    }
}
