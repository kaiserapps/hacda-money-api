import { injectable } from 'inversify';

import { User } from '../../domain/user/user';
import { AuthStrategy } from '../../providers/auth/enums';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
    registerUser(strategy: AuthStrategy, username: string, password?: string): Promise<User> {
        throw new Error('Method not implemented.');
    }

    addSession(username: string, token: string): void {
        throw new Error('Method not implemented.');
    }
}
