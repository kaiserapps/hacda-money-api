import * as fs from 'fs';
import { interfaces } from 'inversify-express-utils';
import * as jwt from 'jsonwebtoken';

import { User } from '../../domain/user/user';
import { IEnvironment } from '../../environments/env.interface';
import { IUserService } from '../../service/user/user.service.interface';
import { BasicJwtProvider } from './basic-jwt.provider';
import { AuthStrategy } from './enums';
import { JwtPrincipal } from './jwt-principal';
import { IJwtProvider } from './jwt.provider.interface';
import { OAuthJwtProvider } from './oauth-jwt.provider';
import { UnauthenticatedPrincipal } from './unauthenticated-principal';

export abstract class JwtProvider implements IJwtProvider {
    jwt: any;
    constructor(
        protected userService: IUserService,
        protected environment: IEnvironment
    ) {
        this.jwt = environment.jwt;
    }

    validateToken(token: string): Promise<interfaces.Principal> {
        return JwtProvider.verifyToken(this.jwt, token).then(decoded => {
            return new JwtPrincipal(decoded);
        }).catch(err => new UnauthenticatedPrincipal(err));
    }

    generateToken(user: User): Promise<string> {
        const cert = fs.readFileSync(this.jwt.privateKeyPath || '');
        const data = {
            strategy: user.strategy,
            roles: user.roles,
            email: user.email,
            given_name: user.givenName,
            family_name: user.familyName,
            profile: (user.oAuthData || {}).profile_url
        };
        return new Promise<string>((resolve, reject) => {
            jwt.sign(data, cert, {
                algorithm: 'RS256',
                expiresIn: this.jwt.tokenExpiration,
                audience: this.jwt.audiences,
                issuer: this.jwt.issuer,
                subject: user.username,
            }, (err, token) => {
                if (err) {
                    reject(err);
                }
                else {
                    this.userService.addSession(user.username, token);
                    resolve(token);
                }
            });
        });
    }

    static getJwtProviderByToken(token: string, environment: IEnvironment, userService: IUserService): Promise<IJwtProvider | null> {
        return this.verifyToken(environment.jwt, token).then(data => {
            return this.getJwtProvider(data.strategy, environment, userService);
        });
    }

    static getJwtProvider(strategy: AuthStrategy, environment: IEnvironment, userService: IUserService): Promise<IJwtProvider | null> {
        let jwtProvider: IJwtProvider | null = null;
        switch (strategy) {
            case AuthStrategy.Basic:
                jwtProvider = new BasicJwtProvider(userService, environment);
                break;
            case AuthStrategy.Facebook:
                jwtProvider = new OAuthJwtProvider(userService, environment, environment.facebookClientId || '', environment.facebookClientSecret || '');
                break;
            case AuthStrategy.Google:
                jwtProvider = new OAuthJwtProvider(userService, environment, environment.googleClientId || '', environment.googleClientSecret || '');
                break;
        }
        return Promise.resolve(jwtProvider);
    }

    static verifyToken(jwtSettings: any, token: string): Promise<any> {
        const cert = fs.readFileSync(jwtSettings.publicKeyPath || '');

        return new Promise<any>((resolve, reject) => {
            jwt.verify(token, cert, {
                audience: jwtSettings.audience,
                issuer: jwtSettings.issuer
            }, function(err, decoded) {
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
