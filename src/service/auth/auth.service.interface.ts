import { interfaces } from 'inversify-express-utils';

export interface IAuthService {
    user: interfaces.Principal;
    checkToken(token: string): void;
}
