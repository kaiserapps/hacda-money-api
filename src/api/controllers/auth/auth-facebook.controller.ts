import { inject } from 'inversify';
import { controller, httpGet, interfaces } from 'inversify-express-utils';
import * as passport from 'passport';
import * as facebook from 'passport-facebook';

import { IEnvironment } from '../../../environments/env.interface';
import { TYPES } from '../../../ioc.types';
import { AuthStrategy } from '../../../providers/auth/enums';
import { IUserService } from '../../../service/user/user.service.interface';
import { OAuthBaseController } from './oauth-base.controller';

@controller('/auth/facebook')
export class AuthFacebookController extends OAuthBaseController implements interfaces.Controller {
    constructor(
        @inject(TYPES.Environment) environment: IEnvironment,
        @inject(TYPES.UserService) userServiceFactory: (authStrategy: AuthStrategy) => IUserService,
    ) {
        super(environment, userServiceFactory, AuthStrategy.Facebook);
        if (environment.facebookClientId && environment.facebookClientSecret) {
            passport.use(new facebook.Strategy({
                clientID: environment.facebookClientId,
                clientSecret: environment.facebookClientSecret,
                callbackURL: 'callback',
                profileFields: ['id', 'displayName', 'name', 'profileUrl', 'email']
            }, (accessToken, refreshToken, profile, cb) => {
                this.verify(accessToken, refreshToken, profile)
                    .then(user => user ? cb(null, user) : cb(`User ${this.getEmail(profile)} not registered successfully.`))
                    .catch(err => cb(err));
            }));
        }
    }

    protected getEmail(profile: facebook.Profile): string {
        return (profile.emails && profile.emails.length) ? profile.emails[0].value : '';
    }

    @httpGet('/login', TYPES.FacebookAuthMiddleware)
    public login() { }

    @httpGet('/callback', TYPES.FacebookAuthMiddleware, TYPES.OAuthSuccessMiddleware)
    public callback() { }
}
