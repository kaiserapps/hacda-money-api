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

    async checkToken(token: string): Promise<IUser> {
        if (!token) {
            return Promise.reject(`Token is required.`);
        }
        const provider = await JwtStatic.getJwtProviderByToken(token, this.environment, this.userService);
        if (!provider) {
            throw new Error(`Provider for bearer token not found.`);
        }
        const principal = await provider.validateToken(token);
        const typedPrincipal = principal as JwtPrincipal;
        const user = await this.userService.findUser(typedPrincipal.details.strategy, typedPrincipal.details.email);
        if (user && user.tokens && user.tokens.indexOf(token) > -1) {
            this.userProvider.user = typedPrincipal;
            return typedPrincipal.details;
        }
        else {
            throw new Error(`Authorization token is invalid.`);
        }
    }

    async login(user: User): Promise<string> {
        const provider = await JwtStatic.getJwtProvider(user.strategy, this.environment, this.userService);
        if (provider) {
            return provider.generateToken(user);
        }
        else {
            throw new Error(`JWT Provider not found for strategy ${user.strategy}!`);
        }
    }
}
