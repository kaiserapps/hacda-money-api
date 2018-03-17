import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { Audit } from './audit';

export interface IAuditRepository {
    userProvider: IUserProvider;
    dateProvider: IDateProvider;
    createAudit(audit: Audit): Promise<void>;
}
