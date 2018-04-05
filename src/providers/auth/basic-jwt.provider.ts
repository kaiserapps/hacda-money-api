import { interfaces } from 'inversify-express-utils';

import { IEnvironment } from '../../environments/env.interface';
import { IUserService } from '../../service/user/user.service.interface';
import { JwtProvider } from './jwt.provider';
import { IJwtProvider } from './jwt.provider.interface';

export class BasicJwtProvider extends JwtProvider implements IJwtProvider {
    constructor(
        userService: IUserService,
        environment: IEnvironment
    ) {
        super(userService, environment);
    }

    async validateToken(token: string): Promise<interfaces.Principal> {
        return super.validateToken(token);
    }
}
