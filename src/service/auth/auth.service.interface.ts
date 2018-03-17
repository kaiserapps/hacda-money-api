import { IUser, User } from '../../domain/user/user';

export interface IAuthService {
    checkToken(token: string): Promise<IUser>;
    login(user: User): Promise<string>;
}
