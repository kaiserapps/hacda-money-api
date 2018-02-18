import { injectable } from 'inversify';

import { User } from './user/user';

@injectable()
export class InMemoryDb {
    users: User[];
    constructor() {
        this.users = [];
    }
}
