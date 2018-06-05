import { IUser } from '../../domain/user/user';

export interface IAuthService {
    checkToken(token: string): Promise<IUser>;
    login(user: IUser): Promise<string>;
}
