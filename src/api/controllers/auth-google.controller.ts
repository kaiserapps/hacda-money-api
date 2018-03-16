import { inject } from 'inversify';
import { controller, httpGet, interfaces, request } from 'inversify-express-utils';
import * as passport from 'passport';
import * as google from 'passport-google-oauth2';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { IUserService } from '../../service/user/user.service.interface';
import { OAuthBaseController } from './oauth-base.controller';

@controller('/auth/google')
export class AuthGoogleController extends OAuthBaseController implements interfaces.Controller {
    constructor(
        @inject(TYPES.Environment) environment: IEnvironment,
        @inject(TYPES.UserService) userService: IUserService
    ) {
        super(environment, userService);
        if (environment.googleClientId && environment.googleClientSecret) {
            passport.use(new google.Strategy({
                clientID: environment.googleClientId,
                clientSecret: environment.googleClientSecret,
                callbackURL: 'callback',
                passReqToCallback: true,
                scope: [
                    'https://www.googleapis.com/auth/plus.login',
                    'https://www.googleapis.com/auth/plus.profile.emails.read'
                ]
            }, (request, accessToken, refreshToken, profile, cb) => {
                this.verify(request, accessToken, refreshToken, profile)
                    .then(user => user ? cb(null, user) : cb(`User ${profile.email} not registered successfully.`))
                    .catch(err => cb(err));
            }));
        }
    }

    @httpGet('/login', TYPES.GoogleAuthMiddleware)
    public login() { }

    @httpGet('/callback', TYPES.GoogleAuthMiddleware, TYPES.OAuthSuccessMiddleware)
    public callback() { }
}
