import * as express from 'express';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, interfaces, next, request, response } from 'inversify-express-utils';
import * as passport from 'passport';
import * as google from 'passport-google-oauth2';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { AuthStrategy } from '../../providers/auth/enums';
import { IAuthService } from '../../service/auth/auth.service.interface';
import { IUserService } from '../../service/user/user.service.interface';

@controller('/auth/google')
export class AuthGoogleController extends BaseHttpController implements interfaces.Controller {
    private _jwtSettings: any;
    constructor(
        @inject(TYPES.Environment) private environment: IEnvironment,
        @inject(TYPES.AuthService) private authService: IAuthService,
        @inject(TYPES.UserService) private userService: IUserService
    ) {
        super();
        this._jwtSettings = environment.jwt || {};
        if (environment.googleClientId && environment.googleClientSecret) {
            passport.use(new google.Strategy({
                clientID: environment.googleClientId,
                clientSecret: environment.googleClientSecret,
                callbackURL: `${environment.url}/auth/google/callback}`,
                scope: [
                    'https://www.googleapis.com/auth/plus.login',
                    'https://www.googleapis.com/auth/plus.profile.emails.read'
                ]
            }, (accessToken, refreshToken, profile, cb) => {
                this.userService.findUser(profile.email).then(user => {
                    if (user) {
                        this.authService.login(user).then(token => {
                            cb(null, user);
                        }).catch(err => cb(err));
                    }
                    else {
                        this.userService.registerUser(AuthStrategy.Google, profile.email, profile.family_name, profile.given_name, profile)
                            .then(() => this.userService.findUser(profile.email))
                            .then(regUser =>
                                regUser ? this.authService.login(regUser).then(token => {
                                    cb(null, regUser);
                                }) : Promise.reject(null))
                            .catch(err => cb(err));
                    }
                }).catch(err => cb(err));
            }));
        }
    }

    @httpGet('/login')
    public login(@request() req: express.Request, @response() res: express.Response, @next() nextFn: express.NextFunction) {
        passport.authenticate('google')(req, res, nextFn);
    }
}
