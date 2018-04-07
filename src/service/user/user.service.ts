import { injectable, unmanaged } from 'inversify';

import { IUser, User } from '../../domain/user/user';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { IEnvironment } from '../../environments/env.interface';
import { AuthStrategy } from '../../providers/auth/enums';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { UserResponse } from './user-response';
import { IUserService } from './user.service.interface';

@injectable()
export abstract class UserService implements IUserService {

    constructor(
        @unmanaged() public environment: IEnvironment,
        @unmanaged() protected userRepository: IUserRepository,
        @unmanaged() protected cryptoProvider: ICryptoProvider,
        @unmanaged() protected dateProvider: IDateProvider
    ) { }

    async registerUser(strategy: AuthStrategy, email: string, displayName: string, oAuthData?: any): Promise<UserResponse> {
        const user = await this.initAndCreateUser(strategy, email, displayName, oAuthData);
        return new UserResponse(user);
    }

    async addSession(strategy: AuthStrategy, email: string, token: string): Promise<void> {
        const user = await this.userRepository.getUser(strategy, email);
        if (user) {
            user.addSession(token);
            await this.userRepository.saveUser(user);
        }
        else {
            throw new Error(`User ${email} not found.`);
        }
    }

    async findUser(strategy: AuthStrategy, email: string): Promise<IUser | null> {
        return this.userRepository.getUser(strategy, email);
    }

    abstract forgotPass(strategy: AuthStrategy, email: string, protocol: string): Promise<string>;

    abstract resetPass(strategy: AuthStrategy, email: string, token: string, password: string): Promise<void>;

    protected async initAndCreateUser(strategy: AuthStrategy, email: string, displayName: string, oAuthData?: any): Promise<IUser> {
        const user = await this.userRepository.initUser(strategy, email, displayName, oAuthData);
        await this.userRepository.createUser(user);
        return user;
    }
}
