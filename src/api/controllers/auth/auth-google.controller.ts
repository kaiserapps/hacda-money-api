import { inject } from 'inversify';
import { controller, httpGet, interfaces } from 'inversify-express-utils';
import * as passport from 'passport';
import * as google from 'passport-google-oauth2';

import { IEnvironment } from '../../../environments/env.interface';
import { TYPES } from '../../../ioc.types';
import { AuthStrategy } from '../../../providers/auth/enums';
import { IUserService } from '../../../service/user/user.service.interface';
import { OAuthBaseController } from './oauth-base.controller';

@controller('/auth/google')
export class AuthGoogleController extends OAuthBaseController implements interfaces.Controller {
    constructor(
        @inject(TYPES.Environment) environment: IEnvironment,
        @inject(TYPES.UserService) userServiceFactory: (authStrategy: AuthStrategy) => IUserService,
    ) {
        super(environment, userServiceFactory, AuthStrategy.Google);
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
                this.verify(accessToken, refreshToken, profile)
                    .then(user => user ? cb(null, user) : cb(`User ${this.getEmail(profile)} not registered successfully.`))
                    .catch(err => cb(err));
            }));
        }
    }

    @httpGet('/login', TYPES.GoogleAuthMiddleware)
    public login() { }

    @httpGet('/callback', TYPES.GoogleAuthMiddleware, TYPES.OAuthSuccessMiddleware)
    public callback() { }
}
