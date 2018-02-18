import { inject, injectable } from 'inversify';
import * as uuid4 from 'uuid/v4';

import { TYPES } from '../../ioc.types';
import { InMemoryDb } from '../in-memory.db';
import { User } from './user';
import { IUserRepository } from './user.repository.interface';

@injectable()
export class UserMemoryRepository implements IUserRepository {
    constructor(
        @inject(TYPES.InMemoryDb) private database: InMemoryDb
    ) { }

    createUser(user: User): Promise<User> {
        user._id = uuid4();
        this.database.users.push(user);
        return Promise.resolve(user);
    }
}
