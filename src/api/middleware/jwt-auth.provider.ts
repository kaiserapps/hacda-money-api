import * as express from 'express';
import { inject, injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';

import { TYPES } from '../../ioc.types';
import { UnauthenticatedPrincipal } from '../../providers/auth/unauthenticated-principal';
import { AuthService } from '../../service/auth/auth.service';

const authService = inject(TYPES.AuthService);

@injectable()
export class JwtAuthProvider implements interfaces.AuthProvider {

    @authService private readonly _authService: AuthService;

    getUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<interfaces.Principal> {
        const header = req.header('Authorization');
        if (!!header && header.toLowerCase().startsWith('Bearer ')) {
            return this._authService.checkToken(header.replace('Bearer ', '')).then(() => {
                return this._authService.user;
            });
        }
        else {
            return Promise.resolve(new UnauthenticatedPrincipal());
        }
    }
}
