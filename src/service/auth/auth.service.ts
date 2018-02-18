import { inject, injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { JwtProvider } from '../../providers/auth/jwt.provider';
import { IUserService } from '../user/user.service.interface';
import { IAuthService } from './auth.service.interface';

@injectable()
export class AuthService implements IAuthService {
    private _user: interfaces.Principal;

    public get user(): interfaces.Principal {
        return this._user;
    }

    constructor(
        @inject(TYPES.Environment) public environment: IEnvironment,
        @inject(TYPES.UserService) public userService: IUserService
    ) { }

    public checkToken(token: string): void {
        JwtProvider.getJwtProviderByToken(token, this.environment, this.userService).then(provider => {
            if (provider) {
                provider.validateToken(token).then(principal => {
                    this._user = principal;
                });
            }
        });
    }
}
