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

export class JwtStatic {
    static getJwtProviderByToken(token: string, environment: IEnvironment, userService: IUserService): Promise<IJwtProvider | null> {
        return JwtStatic.verifyToken(environment.jwt, token).then(data => {
            return JwtStatic.getJwtProvider(data.strategy, environment, userService);
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