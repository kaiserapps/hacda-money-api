import { injectable } from 'inversify';

import { JwtPrincipal } from '../auth/jwt-principal';
import { IUserProvider } from './user.provider.interface';

@injectable()
export class UserProvider implements IUserProvider {
    _user: JwtPrincipal;

    get user(): JwtPrincipal {
        return this._user;
    }

    validate(user: JwtPrincipal): void {
        this._user = user;
    }

    invalidate(): void {
        delete this._user;
    }
}
