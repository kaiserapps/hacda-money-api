import { inject, injectable } from 'inversify';
import * as uuid4 from 'uuid/v4';

import { TYPES } from '../../ioc.types';
import { AuthStrategy } from '../../providers/auth/enums';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { InMemoryDb } from '../in-memory.db';
import { Password } from './password';
import { User } from './user';
import { IUserRepository } from './user.repository.interface';

@injectable()
export class UserMemoryRepository implements IUserRepository {
    constructor(
        @inject(TYPES.InMemoryDb) private database: InMemoryDb,
        @inject(TYPES.CryptoProvider) private cryptoProvider: ICryptoProvider
    ) {
        this.createUser(User.Fixture({
            id: uuid4(),
            strategy: AuthStrategy.Basic,
            email: 'test@test.com',
            displayName: 'Test User',
            password: Password.Fixture(cryptoProvider.hashPassword('password'))
        }));
    }

    getUser(strategy: AuthStrategy, email: string): Promise<User | null> {
        const user = this.database.users.find(x => x.strategy === strategy && x.email === email) || null;
        return Promise.resolve(user);
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
