import { injectable } from 'inversify';

import { User } from './user/user';
import { Audit } from './audit/audit';

@injectable()
export class InMemoryDb {
    audits: Audit[];
    users: User[];
    constructor() {
        this.audits = [];
        this.users = [];
    }
}
