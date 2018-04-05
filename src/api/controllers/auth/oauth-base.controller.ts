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

        passport.deserializeUser(async (id: string, done) => {
            try {
                const user = await this.userService.findUser(this.strategy, id);
                if (user) {
                    done(null, user);
                }
                else {
                    done(`User ${id} not found`);
                }
            }
            catch (err) {
                done(err);
            }
        });
    }

    protected async verify(
        accessToken: string,
        refreshToken: string,
        profile: any
    ): Promise<IUser | null> {
        let user: IUser | null = null;
        let attempts = 1;
        while (!user && attempts < 2) {
            user = await this.userService.findUser(this.strategy, this.getEmail(profile));
            if (!user) {
                await this.userService.registerUser(this.strategy, this.getEmail(profile), profile.displayName, profile);
            }
            attempts++;
        }
        return user;
    }

    protected getEmail(profile: any): string {
        return profile.email;
    }
}
