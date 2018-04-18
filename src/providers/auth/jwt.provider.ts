import * as fs from 'fs';
import { interfaces } from 'inversify-express-utils';
import * as jwt from 'jsonwebtoken';

import { User } from '../../domain/user/user';
import { IEnvironment } from '../../environments/env.interface';
import { IUserService } from '../../service/user/user.service.interface';
import { AuthStrategy } from './enums';
import { JwtPrincipal } from './jwt-principal';
import { IJwtProvider } from './jwt.provider.interface';
import { UnauthenticatedPrincipal } from './unauthenticated-principal';

export class JwtProvider implements IJwtProvider {
    jwt: any;
    constructor(
        private userService: IUserService,
        private environment: IEnvironment
    ) {
        this.jwt = environment.jwt;
    }

    async validateToken(token: string): Promise<interfaces.Principal> {
        try {
            const decoded = await this.verifyToken(this.jwt, token);
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

        // Generate the JWT and add it to the user's session
        const tkn = await this.signToken(data, cert, opts);
        await this.userService.addSession(user.strategy, user.email, tkn);
        return tkn;
    }

    private async signToken(payload: any, secret: jwt.Secret, options: jwt.SignOptions): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const that = this;
            jwt.sign(payload, secret, options, (err, token) => {
                err ? reject(err) : resolve(token);
            });
        });
    }

    private async verifyToken(jwtSettings: any, token: string): Promise<any> {
        const cert = fs.readFileSync(jwtSettings.publicKeyPath || '');

        return new Promise<any>((resolve, reject) => {
            jwt.verify(token, cert, {
                algorithms: ['RS256'],
                audience: jwtSettings.audience,
                issuer: jwtSettings.issuer
            }, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}
