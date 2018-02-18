import { User } from '../../domain/user/user';
import { AuthStrategy } from '../../providers/auth/enums';

export interface IUserService {
    registerUser(strategy: AuthStrategy, username: string, password?: string): Promise<User>;
    addSession(username: string, token: string): void;
    findUser(strategy: AuthStrategy, username: string): Promise<User>;
}
