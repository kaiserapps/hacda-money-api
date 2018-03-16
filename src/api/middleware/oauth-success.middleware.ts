import * as express from 'express';
import { inject, injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

import { User } from '../../domain/user/user';
import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { IAuthService } from '../../service/auth/auth.service.interface';

@injectable()
export class OAuthSuccessMiddleware extends BaseMiddleware {
    @inject(TYPES.AuthService) private readonly authService: IAuthService;
    @inject(TYPES.Environment) private readonly environment: IEnvironment;
    public handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        this.authService.login(req.user as User).then(token => {
            res.redirect(`${req.protocol}://${this.environment.clientUrl}/auth/success?jwt=${token}`);
        });
    }
}
