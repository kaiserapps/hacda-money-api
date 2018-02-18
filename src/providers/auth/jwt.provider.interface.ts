import { interfaces } from 'inversify-express-utils';

import { User } from '../../domain/user/user';

export interface IJwtProvider {
    validateToken(token: string): Promise<interfaces.Principal>;
    generateToken(user: User): Promise<string>;
}
