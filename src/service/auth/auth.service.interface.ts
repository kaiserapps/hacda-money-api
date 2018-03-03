import { interfaces } from 'inversify-express-utils';

import { User } from '../../domain/user/user';

export interface IAuthService {
    user: interfaces.Principal;
    checkToken(token: string): Promise<void>;
    login(user: User): Promise<string>;
}
