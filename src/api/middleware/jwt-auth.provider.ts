import * as chalk from 'chalk';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';

import { TYPES } from '../../ioc.types';
import { UnauthenticatedPrincipal } from '../../providers/auth/unauthenticated-principal';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { IAuthService } from '../../service/auth/auth.service.interface';

@injectable()
export class JwtAuthProvider implements interfaces.AuthProvider {
    @inject(TYPES.AuthService) private readonly _authService: IAuthService;
    @inject(TYPES.UserProvider) private readonly _userProvider: IUserProvider;

    getUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<interfaces.Principal> {
        const authHeader = req.header('Authorization');
        if (!!authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
            return this._authService.checkToken(authHeader.split(' ')[1]).then(() => {
                return this._userProvider.user;
            }).catch(err => {
                console.error(chalk.default.red(`Error authenticating JWT: ${err}`));
                return new UnauthenticatedPrincipal();
            });
        }
        else {
            return Promise.resolve(new UnauthenticatedPrincipal());
        }
    }
}
