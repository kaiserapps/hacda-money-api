import { injectable, unmanaged } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import * as passport from 'passport';

import { User } from '../../domain/user/user';
import { IEnvironment } from '../../environments/env.interface';
import { AuthStrategy } from '../../providers/auth/enums';
import { IUserService } from '../../service/user/user.service.interface';

@injectable()
export abstract class OAuthBaseController implements interfaces.Controller {
    constructor(
        @unmanaged() protected environment: IEnvironment,
        @unmanaged() protected userService: IUserService,
        @unmanaged() protected strategy: AuthStrategy
    ) {
        passport.serializeUser((user: User, done) => {
            done(null, user.email);
        });

        passport.deserializeUser((id: string, done) => {
            this.userService.findUser(this.strategy, id)
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
        return this.userService.findUser(this.strategy, this.getEmail(profile)).then(user => {
            if (user) {
                return user;
            }
            else {
                return this.userService.registerOAuthUser(this.strategy, this.getEmail(profile), profile.displayName, profile)
                    .then(() => this.userService.findUser(this.strategy, this.getEmail(profile)));
            }
        });
    }

    protected getEmail(profile: any): string {
        return profile.email;
    }
}
