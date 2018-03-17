import { JwtPrincipal } from '../auth/jwt-principal';
import { IUserProvider } from './user.provider.interface';

export class UserProvider implements IUserProvider {
    user: JwtPrincipal;
}
