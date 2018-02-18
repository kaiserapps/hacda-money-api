import { inject, injectable } from 'inversify';
import * as uuid4 from 'uuid/v4';

import { TYPES } from '../../ioc.types';
import { AuthStrategy } from '../../providers/auth/enums';
import { InMemoryDb } from '../in-memory.db';
import { User } from './user';
import { IUserRepository } from './user.repository.interface';

@injectable()
export class UserMemoryRepository implements IUserRepository {
    constructor(
        @inject(TYPES.InMemoryDb) private database: InMemoryDb
    ) { }

    getUserByStrategyAndUsername(strategy: AuthStrategy, username: string): Promise<User> {
        const user = this.database.users.find(x => x.strategy === strategy && x.username === username);
        if (user) {
            return Promise.resolve(user);
        }
        else {
            return Promise.reject(`User ${username} not found!`);
        }
    }

    createUser(user: User): Promise<User> {
        user._id = uuid4();
        this.database.users.push(user);
        return Promise.resolve(user);
    }
}
