import { inject, injectable } from 'inversify';

import { IUser, User } from '../../domain/user/user';
import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { JwtPrincipal } from '../../providers/auth/jwt-principal';
import { JwtStatic } from '../../providers/auth/jwt.static';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { IUserService } from '../user/user.service.interface';
import { IAuthService } from './auth.service.interface';

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.Environment) private environment: IEnvironment,
        @inject(TYPES.UserService) private userService: IUserService,
        @inject(TYPES.UserProvider) private userProvider: IUserProvider
    ) { }

    public checkToken(token: string): Promise<IUser> {
        if (!token) {
            return Promise.reject(`Token is required.`);
        }
        return JwtStatic.getJwtProviderByToken(token, this.environment, this.userService).then(provider => {
            if (!provider) {
                throw new Error(`Provider for bearer token not found.`);
            }
            return provider.validateToken(token).then(principal => {
                const typedPrincipal = principal as JwtPrincipal;
                return this.userService.findUser(typedPrincipal.details.strategy, typedPrincipal.details.email).then(user => {
                    if (user && user.tokens.indexOf(token) > -1) {
                        this.userProvider.user = typedPrincipal;
                        return typedPrincipal.details;
                    }
                    else {
                        throw new Error(`Authorization token is invalid.`);
                    }
                });
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
