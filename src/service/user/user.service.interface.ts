import { User } from '../../domain/user/user';
import { AuthStrategy } from '../../providers/auth/enums';

export interface IUserService {
    registerUser(strategy: AuthStrategy, email: string, familyName: string, givenName: string, oAuthData?: any): Promise<User>;
    addSession(email: string, token: string): Promise<void>;
    findUser(email: string): Promise<User>;
    forgotPass(email: string): Promise<void>;
    resetPass(email: string, token: string, password: string): Promise<void>;
}
