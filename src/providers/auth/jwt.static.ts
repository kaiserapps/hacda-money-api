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
    static async getJwtProviderByToken(token: string, environment: IEnvironment, userService: IUserService): Promise<IJwtProvider | null> {
        const data = await JwtStatic.verifyToken(environment.jwt, token);
        return JwtStatic.getJwtProvider(data.strategy, environment, userService);
    }

    static getJwtProvider(strategy: AuthStrategy, environment: IEnvironment, userService: IUserService): IJwtProvider | null {
        let jwtProvider: IJwtProvider | null = null;
        switch (strategy) {
            case AuthStrategy.Basic:
                jwtProvider = new BasicJwtProvider(userService, environment);
                break;
            case AuthStrategy.Facebook:
                jwtProvider = new OAuthJwtProvider(userService, environment, environment.facebookClientId || '', environment.facebookClientSecret || '');
                break;
            case AuthStrategy.Github:
                jwtProvider = new OAuthJwtProvider(userService, environment, environment.githubClientId || '', environment.githubClientSecret || '');
                break;
            case AuthStrategy.Google:
                jwtProvider = new OAuthJwtProvider(userService, environment, environment.googleClientId || '', environment.googleClientSecret || '');
                break;
        }
        return jwtProvider;
    }

    static async verifyToken(jwtSettings: any, token: string): Promise<any> {
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
