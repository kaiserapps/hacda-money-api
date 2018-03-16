import * as express from 'express';
import { interfaces, request } from 'inversify-express-utils';
import * as passport from 'passport';

import { User } from '../../domain/user/user';
import { IEnvironment } from '../../environments/env.interface';
import { AuthStrategy } from '../../providers/auth/enums';
import { IUserService } from '../../service/user/user.service.interface';

export class OAuthBaseController implements interfaces.Controller {
    constructor(
        protected environment: IEnvironment,
        protected userService: IUserService
    ) {
        passport.serializeUser((user: User, done) => {
            done(null, user.email);
        });

        passport.deserializeUser((id: string, done) => {
            console.log(id);
            this.userService.findUser(id)
                .then(user => {
                    console.log(user);
                    user ? done(null, user) : done(`User ${id} not found`);
                })
                .catch(err => done(err));
        });
    }

    protected verify(
        request: express.Request,
        accessToken: string,
        refreshToken: string,
        profile: any
    ): Promise<User | null> {
        return this.userService.findUser(profile.email).then(user => {
            if (user) {
                return user;
            }
            else {
                return this.userService.registerUser(AuthStrategy.Google, profile.email, profile.family_name, profile.given_name, profile)
                    .then(() => this.userService.findUser(profile.email));
            }
        });
    }
}
