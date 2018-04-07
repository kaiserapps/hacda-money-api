import { IUser } from '../../domain/user/user';
import { IEmail } from '../../providers/email/email.provider.interface';

export interface IUserPasswordService {
    httpProtocol: string;
    resetPassword(user: IUser, isActivation?: boolean): Promise<string>;
}
