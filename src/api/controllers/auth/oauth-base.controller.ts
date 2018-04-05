import { injectable, unmanaged } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import * as passport from 'passport';

import { IUser, User } from '../../../domain/user/user';
import { IEnvironment } from '../../../environments/env.interface';
import { AuthStrategy } from '../../../providers/auth/enums';
import { IUserService } from '../../../service/user/user.service.interface';

@injectable()
export abstract class OAuthBaseController implements interfaces.Controller {
    protected userService: IUserService;
    constructor(
        @unmanaged() protected environment: IEnvironment,
        @unmanaged() userServiceFactory: (authStrategy: AuthStrategy) => IUserService,
        @unmanaged() protected strategy: AuthStrategy
    ) {
        this.userService = userServiceFactory(strategy);
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
    ): Promise<IUser | null> {
        return this.userService.findUser(this.strategy, this.getEmail(profile)).then(user => {
            if (user) {
                return user;
            }
            else {
                return this.userService.registerUser(this.strategy, this.getEmail(profile), profile.displayName, profile)
                    .then(() => this.userService.findUser(this.strategy, this.getEmail(profile)));
            }
        });
    }

    protected getEmail(profile: any): string {
        return profile.email;
    }
}
