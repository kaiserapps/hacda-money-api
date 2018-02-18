import * as express from 'express';
import { inject, injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';

import { TYPES } from '../../ioc.types';
import { AuthService } from '../../service/auth/auth.service';

const authService = inject(TYPES.AuthService);

@injectable()
export class CustomAuthProvider implements interfaces.AuthProvider {

    @authService private readonly _authService: AuthService;

    getUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<interfaces.Principal> {
        return Promise.resolve(this._authService.user);
    }
}
