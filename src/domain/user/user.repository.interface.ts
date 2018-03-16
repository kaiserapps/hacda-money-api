import { AuthStrategy } from '../../providers/auth/enums';
import { User } from './user';

export interface IUserRepository {
    getUser(strategy: AuthStrategy, email: string): Promise<User | null>;
    createUser(user: User): Promise<void>;
    saveUser(user: User): Promise<void>;
}
