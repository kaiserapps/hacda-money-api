import { interfaces } from 'inversify-express-utils';

import { IEnvironment } from '../../environments/env.interface';
import { IUserService } from '../../service/user/user.service.interface';
import { JwtProvider } from './jwt.provider';
import { IJwtProvider } from './jwt.provider.interface';

export class OAuthJwtProvider extends JwtProvider implements IJwtProvider {
    constructor(
        userService: IUserService,
        environment: IEnvironment,
        protected clientId: string,
        protected clientSecret: string
    ) {
        super(userService, environment);
    }

    validateToken(token: string): Promise<interfaces.Principal> {
        return super.validateToken(token);
    }
}
