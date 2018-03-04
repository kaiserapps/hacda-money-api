import { inject, injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';

import { User } from '../../domain/user/user';
import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { JwtProvider } from '../../providers/auth/jwt.provider';
import { JwtStatic } from '../../providers/auth/jwt.static';
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

    public checkToken(token: string): Promise<void> {
        if (!token) {
            return Promise.reject(`Token is required.`);
        }
        return JwtStatic.getJwtProviderByToken(token, this.environment, this.userService).then(provider => {
            if (!provider) {
                return Promise.reject(`Provider for bearer token not found.`);
            }
            return provider.validateToken(token).then(principal => {
                this._user = principal;
            });
        });
    }

    public login(user: User): Promise<string> {
        return JwtStatic.getJwtProvider(user.strategy, this.environment, this.userService).then(provider => {
            if (provider) {
                return provider.generateToken(user);
            }
            else {
                return Promise.reject(`JWT Provider not found for strategy ${user.strategy}!`);
            }
        });
    }
}
