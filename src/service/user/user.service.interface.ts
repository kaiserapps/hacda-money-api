import { IUser } from '../../domain/user/user';
import { AuthStrategy } from '../../providers/auth/enums';
import { UserResponse } from './user-response';

export interface IUserService {
    registerUser(strategy: AuthStrategy, email: string, displayName: string, oAuthData?: any): Promise<UserResponse>;
    addSession(strategy: AuthStrategy, email: string, token: string): Promise<void>;
    findUser(strategy: AuthStrategy, email: string): Promise<IUser | null>;
    forgotPass(strategy: AuthStrategy, email: string, protocol: string): Promise<string>;
    resetPass(strategy: AuthStrategy, email: string, token: string, password: string): Promise<void>;
}
