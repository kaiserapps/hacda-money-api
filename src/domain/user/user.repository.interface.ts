import { AuthStrategy } from '../../providers/auth/enums';
import { IAuditRepository } from '../audit/audit.repository.interface';
import { IUser } from './user';

export interface IUserRepository {
    auditRepository: IAuditRepository;
    getUser(strategy: AuthStrategy, email: string): Promise<IUser | null>;
    createUser(user: IUser): Promise<void>;
    saveUser(user: IUser): Promise<void>;
}
