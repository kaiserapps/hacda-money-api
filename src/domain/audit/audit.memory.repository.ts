import { inject, injectable } from 'inversify';
import * as uuid4 from 'uuid/v4';

import { TYPES } from '../../ioc.types';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { InMemoryDb } from '../in-memory.db';
import { Audit } from './audit';
import { AuditRepository } from './audit.repository';
import { IAuditRepository } from './audit.repository.interface';
import { AuditType } from './enums';

@injectable()
export class AuditMemoryRepository extends AuditRepository implements IAuditRepository {
    constructor(
        @inject(TYPES.InMemoryDb) private database: InMemoryDb,
        @inject(TYPES.DateProvider) dateProvider: IDateProvider,
        @inject(TYPES.UserProvider) userProvider: IUserProvider
    ) {
        super(dateProvider, userProvider);
    }

    async createAudit(klass: string, action: AuditType, data?: any): Promise<void> {
        const audit = new Audit(klass, action, this.getDiff(klass, action, data));
        audit._id = uuid4();
        audit.username = this.userProvider.user && this.userProvider.user.details ? this.userProvider.user.details.email : 'Anonymous';
        audit.timestamp = this.dateProvider.currentDateTicks;
        this.database.audits.push(audit);
        return Promise.resolve();
    }

    async getLatest(klass: string, max?: number): Promise<Audit> {
        return this.database.audits
            .filter(x => x.timestamp < (max || this.dateProvider.currentDateTicks))
            .sort((a: Audit, b: Audit) => a.timestamp < b.timestamp ? 1 : -1)
            [0];
    }
}
