import { AuthStrategy } from '../../providers/auth/enums';
import { User } from './user';

export interface IUserRepository {
    getUserByStrategyAndUsername(strategy: AuthStrategy, username: string): Promise<User>;
    createUser(user: User): Promise<User>;
}
