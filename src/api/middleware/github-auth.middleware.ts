import * as express from 'express';
import { inject, injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import * as passport from 'passport';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';

@injectable()
export class GithubAuthMiddleware extends BaseMiddleware {
    @inject(TYPES.Environment) private readonly environment: IEnvironment;
    public handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (this.environment.githubClientId && this.environment.githubClientSecret) {
            return passport.authenticate('github', {
                failureRedirect: `${req.protocol}://${this.environment.clientUrl}/auth/failure`
            })(req, res, next);
        }
        else {
            res.status(500).json({ error: 'Github Auth is missing or configured incorrectly.' });
        }
    }
}
