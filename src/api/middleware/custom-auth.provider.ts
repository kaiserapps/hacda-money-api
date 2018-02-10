import { injectable, inject } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import * as express from 'express';

import { AuthService } from '../../service/auth.service';
import { TYPES } from '../../ioc-types';

const authService = inject(TYPES.AuthService);

@injectable()
export class CustomAuthProvider implements interfaces.AuthProvider {

    @authService private readonly _authService: AuthService;

    getUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<interfaces.Principal> {
        return Promise.resolve(this._authService.getUser());
    }
}
