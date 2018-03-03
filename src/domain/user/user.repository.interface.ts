import { AuthStrategy } from '../../providers/auth/enums';
import { User } from './user';

export interface IUserRepository {
    getUser(email: string): Promise<User>;
    createUser(user: User): Promise<void>;
    saveUser(user: User): Promise<void>;
}
