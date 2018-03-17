import { injectable } from 'inversify';

import { JwtPrincipal } from '../auth/jwt-principal';
import { IUserProvider } from './user.provider.interface';

@injectable()
export class UserProvider implements IUserProvider {
    user: JwtPrincipal;
}
