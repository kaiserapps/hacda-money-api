import { inject } from 'inversify';
import { controller, httpGet, interfaces } from 'inversify-express-utils';
import * as passport from 'passport';
import * as github from 'passport-github';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { AuthStrategy } from '../../providers/auth/enums';
import { IUserService } from '../../service/user/user.service.interface';
import { OAuthBaseController } from './oauth-base.controller';

@controller('/auth/github')
export class AuthGithubController extends OAuthBaseController implements interfaces.Controller {
    constructor(
        @inject(TYPES.Environment) environment: IEnvironment,
        @inject(TYPES.UserService) userService: IUserService
    ) {
        super(environment, userService, AuthStrategy.Github);
        if (environment.githubClientId && environment.githubClientSecret) {
            passport.use(new github.Strategy({
                clientID: environment.githubClientId,
                clientSecret: environment.githubClientSecret,
                callbackURL: 'callback',
                scope: ['user:email']
            }, (accessToken, refreshToken, profile, cb) => {
                this.verify(accessToken, refreshToken, profile)
                    .then(user => user ? cb(null, user) : cb(`User ${this.getEmail(profile)} not registered successfully.`))
                    .catch(err => cb(err));
            }));
        }
    }

    protected getEmail(profile: github.Profile): string {
        return (profile.emails && profile.emails.length) ? profile.emails[0].value : '';
    }

    @httpGet('/login', TYPES.GithubAuthMiddleware)
    public login() { }

    @httpGet('/callback', TYPES.GithubAuthMiddleware, TYPES.OAuthSuccessMiddleware)
    public callback() { }
}
