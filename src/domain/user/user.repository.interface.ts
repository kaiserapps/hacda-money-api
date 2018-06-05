import { AuthStrategy } from '../../providers/auth/enums';
import { IAuditRepository } from '../audit/audit.repository.interface';
import { IUser } from './user';

export interface IUserRepository {
    auditRepository: IAuditRepository;
    initUser(strategy: AuthStrategy, email: string, displayName: string, oAuthData?: any): Promise<IUser>;
    getUser(strategy: AuthStrategy, email: string): Promise<IUser | null>;
    createUser(user: IUser): Promise<void>;
    saveUser(user: IUser): Promise<void>;
}
