import { inject, injectable } from 'inversify';
import * as uuid4 from 'uuid/v4';

import { TYPES } from '../../ioc.types';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { InMemoryDb } from '../in-memory.db';
import { Audit } from './audit';
import { IAuditRepository } from './audit.repository.interface';

@injectable()
export class AuditMemoryRepository implements IAuditRepository {
    constructor(
        @inject(TYPES.InMemoryDb) private database: InMemoryDb,
        @inject(TYPES.DateProvider) public dateProvider: IDateProvider,
        @inject(TYPES.UserProvider) public userProvider: IUserProvider
    ) {
    }

    createAudit(audit: Audit): Promise<void> {
        audit._id = uuid4();
        audit.username = this.userProvider.user && this.userProvider.user.details ? this.userProvider.user.details.email : 'Anonymous';
        audit.timestamp = this.dateProvider.currentDateTicks;
        this.database.audits.push(audit);
        return Promise.resolve();
    }
}
