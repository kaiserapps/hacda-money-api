import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { Audit } from './audit';
import { AuditType } from './enums';

export interface IAuditRepository {
    userProvider: IUserProvider;
    dateProvider: IDateProvider;
    createAudit(klass: string, action: AuditType, data?: any): Promise<void>;
    getLatest(klass: string, timestamp?: number): Promise<Audit>;
}
