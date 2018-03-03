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

    getUser(email: string): Promise<User> {
        const user = this.database.users.find(x => x.email === email);
        if (user) {
            return Promise.resolve(user);
        }
        else {
            return Promise.reject(`User with email address ${email} not found!`);
        }
    }

    createUser(user: User): Promise<void> {
        user._id = uuid4();
        this.database.users.push(user);
        return Promise.resolve();
    }

    saveUser(user: User): Promise<void> {
        const idx = this.database.users.findIndex(x => x._id === user._id);
        if (idx < 0) {
            return Promise.reject(`User with email address ${user.email} not found!`);
        }
        this.database.users[idx] = user;
        return Promise.resolve();
    }
}
