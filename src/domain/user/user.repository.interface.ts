import { AuthStrategy } from '../../providers/auth/enums';
import { IAuditRepository } from '../audit/audit.repository.interface';
import { User } from './user';

export interface IUserRepository {
    auditRepository: IAuditRepository;
    getUser(strategy: AuthStrategy, email: string): Promise<User | null>;
    createUser(user: User): Promise<void>;
    saveUser(user: User): Promise<void>;
}
