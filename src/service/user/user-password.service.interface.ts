import { IUser } from '../../domain/user/user';

export interface IUserPasswordService {
    httpProtocol: string;
    resetPassword(user: IUser, isActivation?: boolean): Promise<string>;
}
