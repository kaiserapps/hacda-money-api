import * as fs from 'fs';
import { interfaces } from 'inversify-express-utils';
import * as jwt from 'jsonwebtoken';

import { User } from '../../domain/user/user';
import { AuthStrategy } from './enums';
import { IEnvironment } from '../../environments/env.interface';
import { IUserService } from '../../service/user/user.service.interface';
import { JwtPrincipal } from './jwt-principal';
import { IJwtProvider } from './jwt.provider.interface';
import { JwtStatic } from './jwt.static';
import { UnauthenticatedPrincipal } from './unauthenticated-principal';

export abstract class JwtProvider implements IJwtProvider {
    jwt: any;
    constructor(
        protected userService: IUserService,
        protected environment: IEnvironment
    ) {
        this.jwt = environment.jwt;
    }

    async validateToken(token: string): Promise<interfaces.Principal> {
        try {
            const decoded = await JwtStatic.verifyToken(this.jwt, token);
            return new JwtPrincipal(decoded);
        }
        catch (err) {
            return new UnauthenticatedPrincipal(err);
        }
    }

    async generateToken(user: User): Promise<string> {
        // Get the secret key file contents
        const cert = fs.readFileSync(this.jwt.privateKeyPath || '') as jwt.Secret;

        // Assign claims
        const data = {
            strategy: user.strategy,
            strategyName: AuthStrategy[user.strategy],
            roles: user.roles,
            email: user.email,
            name: user.displayName,
            profile: (user.oAuthData || {}).profile_url
        };

        // More claims as JWT options
        const opts: jwt.SignOptions = {
            algorithm: 'RS256',
            expiresIn: this.jwt.tokenExpiration,
            audience: this.jwt.audiences,
            issuer: this.jwt.issuer,
            subject: user.email,
        }

        // Set up the async signing function
        const signJwt = async (payload: any, secret: jwt.Secret, options: jwt.SignOptions) => {
            return new Promise<string>((resolve, reject) => {
                const that = this;
                jwt.sign(payload, cert, opts, (err, token) => {
                    err ? reject(err) : resolve(token);
                });
            });
        };

        // Generate the JWT and add it to the user's session
        const tkn = await signJwt(data, cert, opts);
        await this.userService.addSession(user.strategy, user.email, tkn);
        return tkn;
    }
}
