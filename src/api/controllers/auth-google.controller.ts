import * as express from 'express';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, interfaces, next, request, response, queryParam } from 'inversify-express-utils';
import * as passport from 'passport';
import * as google from 'passport-google-oauth2';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { AuthStrategy } from '../../providers/auth/enums';
import { IAuthService } from '../../service/auth/auth.service.interface';
import { IUserService } from '../../service/user/user.service.interface';
import { IUser, User } from '../../domain/user/user';

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

        passport.serializeUser((user: User, done) => {
            done(null, user.email);
        });

        passport.deserializeUser((id: string, done) => {
            this.userService.findUser(id)
                .then(user => user ? done(null, user) : done(`User ${id} not found`))
                .catch(err => done(err));
        });

        if (environment.googleClientId && environment.googleClientSecret) {
            passport.use(new google.Strategy({
                clientID: environment.googleClientId,
                clientSecret: environment.googleClientSecret,
                callbackURL: 'callback',
                scope: [
                    'https://www.googleapis.com/auth/plus.login',
                    'https://www.googleapis.com/auth/plus.profile.emails.read'
                ]
            }, (accessToken, refreshToken, profile, cb) => {
                this.userService.findUser(profile.email).then(user => {
                    if (user) {
                        cb(null, user);
                    }
                    else {
                        this.userService.registerUser(AuthStrategy.Google, profile.email, profile.family_name, profile.given_name, profile)
                            .then(() => this.userService.findUser(profile.email))
                            .then(regUser => regUser ? cb(null, regUser) : cb(`User ${profile.email} not registered successfully.`))
                            .catch(err => cb(err));
                    }
                }).catch(err => cb(err));
            }));
        }
    }

    @httpGet('/login')
    public login(
        @request() req: express.Request,
        @response() res: express.Response,
        @next() nextFn: express.NextFunction
    ) {
        return passport.authenticate('google')(req, res, nextFn);
    }

    @httpGet('/callback')
    public callback(
        @request() req: express.Request,
        @response() res: express.Response,
        @next() nextFn: express.NextFunction
    ) {
        return passport.authenticate('google', {
            failureRedirect: `${req.protocol}://${this.environment.clientUrl}/auth/google/failure`,
        }, (user: User) => {
            this.authService.login(user as User).then(token => {
                res.redirect(`${req.protocol}://${this.environment.clientUrl}/auth/google/success?jwt=${token}`);
            });
        })(req, res, nextFn);
    }
}
