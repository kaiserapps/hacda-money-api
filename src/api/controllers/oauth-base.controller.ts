import { injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import * as passport from 'passport';

import { User } from '../../domain/user/user';
import { IEnvironment } from '../../environments/env.interface';
import { AuthStrategy } from '../../providers/auth/enums';
import { IUserService } from '../../service/user/user.service.interface';

@injectable()
export class OAuthBaseController implements interfaces.Controller {
    constructor(
        protected environment: IEnvironment,
        protected userService: IUserService
    ) {
        passport.serializeUser((user: User, done) => {
            done(null, user.email);
        });

        passport.deserializeUser((id: string, done) => {
            this.userService.findUser(id)
                .then(user => {
                    user ? done(null, user) : done(`User ${id} not found`);
                })
                .catch(err => done(err));
        });
    }

    protected verify(
        accessToken: string,
        refreshToken: string,
        profile: any
    ): Promise<User | null> {
        return this.userService.findUser(this.getEmail(profile)).then(user => {
            if (user) {
                return user;
            }
            else {
                return this.userService.registerUser(AuthStrategy.Google, this.getEmail(profile), profile.displayName, profile)
                    .then(() => this.userService.findUser(this.getEmail(profile)));
            }
        });
    }

    protected getEmail(profile: any): string {
        return profile.email;
    }
}
