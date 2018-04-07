import { injectable } from 'inversify';

import { AuthStrategy } from '../../providers/auth/enums';
import { IAuditRepository } from '../audit/audit.repository.interface';
import { IUser, User } from './user';
import { IUserRepository } from './user.repository.interface';

@injectable()
export abstract class UserRepository implements IUserRepository {
    abstract auditRepository: IAuditRepository;

    async initUser(strategy: AuthStrategy, email: string, displayName: string, oAuthData?: any): Promise<IUser> {
        return User.register(this, strategy, email, displayName, oAuthData);
    }

    abstract getUser(strategy: AuthStrategy, email: string): Promise<IUser | null>;
    abstract createUser(user: IUser): Promise<void>;
    abstract saveUser(user: IUser): Promise<void>;
}
