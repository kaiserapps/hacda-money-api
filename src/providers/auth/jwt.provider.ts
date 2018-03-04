import * as fs from 'fs';
import { interfaces } from 'inversify-express-utils';
import * as jwt from 'jsonwebtoken';

import { User } from '../../domain/user/user';
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

    validateToken(token: string): Promise<interfaces.Principal> {
        return JwtStatic.verifyToken(this.jwt, token).then(decoded => {
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
                subject: user.email,
            }, (err, token) => {
                if (err) {
                    reject(err);
                }
                else {
                    this.userService.addSession(user.email, token).then(() => {
                        resolve(token);
                    });
                }
            });
        });
    }
}
