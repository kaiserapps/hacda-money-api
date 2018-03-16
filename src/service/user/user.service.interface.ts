import { User } from '../../domain/user/user';
import { AuthStrategy } from '../../providers/auth/enums';
import { UserResponse } from './user-response';

export interface IUserService {
    registerUser(strategy: AuthStrategy, email: string, displayName: string, oAuthData?: any): Promise<UserResponse>;
    addSession(email: string, token: string): Promise<void>;
    findUser(email: string): Promise<User | null>;
    forgotPass(email: string): Promise<string>;
    resetPass(email: string, token: string, password: string): Promise<void>;
}
