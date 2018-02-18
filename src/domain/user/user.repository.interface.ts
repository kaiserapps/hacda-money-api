import { User } from './user';

export interface IUserRepository {
    createUser(user: User): Promise<User>;
}
