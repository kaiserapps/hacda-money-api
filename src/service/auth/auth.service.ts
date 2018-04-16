import { inject, injectable } from 'inversify';

import { IUser, User } from '../../domain/user/user';
import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { JwtPrincipal } from '../../providers/auth/jwt-principal';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { IUserService } from '../user/user.service.interface';
import { IAuthService } from './auth.service.interface';
import { IJwtProvider } from '../../providers/auth/jwt.provider.interface';
import { UnauthenticatedPrincipal } from '../../providers/auth/unauthenticated-principal';

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.Environment) private environment: IEnvironment,
        @inject(TYPES.UserService) private userService: IUserService,
        @inject(TYPES.UserProvider) private userProvider: IUserProvider,
        @inject(TYPES.JwtProvider) private jwtProvider: IJwtProvider
    ) { }

    async checkToken(token: string): Promise<IUser> {
        if (!token) {
            throw new Error(`Token is required.`);
        }

        const principal = await this.jwtProvider.validateToken(token);
        if (principal instanceof UnauthenticatedPrincipal) {
            throw new Error(principal.details);
        }
        else if (!principal) {
            throw new Error(`Token validation failed.`);
        }

        this.userProvider.validate(principal as JwtPrincipal);
        const user = await this.userService.findUser(this.userProvider.user.details.strategy, this.userProvider.user.details.email);
        if (user && user.tokens && user.tokens.indexOf(token) > -1) {
            return this.userProvider.user.details;
        }
        else {
            this.userProvider.invalidate();
            throw new Error(`Authorization token is invalid.`);
        }
    }

    async login(user: User): Promise<string> {
        return this.jwtProvider.generateToken(user);
    }
}
