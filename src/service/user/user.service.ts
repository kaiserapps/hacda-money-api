import { inject, injectable } from 'inversify';

import { User } from '../../domain/user/user';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { TYPES } from '../../ioc.types';
import { AuthStrategy } from '../../providers/auth/enums';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {

    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository
    ) { }

    registerUser(strategy: AuthStrategy, username: string, password?: string): Promise<User> {
        throw new Error('Method not implemented.');
    }

    addSession(username: string, token: string): void {
        throw new Error('Method not implemented.');
    }

    findUser(strategy: AuthStrategy, username: string): Promise<User> {
        return this.userRepository.getUserByStrategyAndUsername(strategy, username);
    }
}
