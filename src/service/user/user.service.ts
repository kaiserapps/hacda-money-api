import { inject, injectable, unmanaged } from 'inversify';

import { Password } from '../../domain/user/password';
import { User, IUser } from '../../domain/user/user';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { IEnvironment } from '../../environments/env.interface';
import { ONE_DAY_IN_SECONDS } from '../../global-const';
import { TYPES } from '../../ioc.types';
import { AuthStrategy } from '../../providers/auth/enums';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IEmail, IEmailProvider } from '../../providers/email/email.provider.interface';
import { UserResponse } from './user-response';
import { IUserService } from './user.service.interface';

@injectable()
export abstract class UserService implements IUserService {

    constructor(
        @unmanaged() public environment: IEnvironment,
        @unmanaged() protected userRepository: IUserRepository,
        @unmanaged() protected cryptoProvider: ICryptoProvider,
        @unmanaged() protected dateProvider: IDateProvider,
    ) { }

    registerUser(strategy: AuthStrategy, email: string, displayName: string, oAuthData?: any): Promise<UserResponse> {
        return User.register(this.userRepository, strategy, email, displayName, oAuthData).then(user => {
            return this.userRepository.createUser(user).then(() => new UserResponse(user));
        });
    }

    addSession(strategy: AuthStrategy, email: string, token: string): Promise<void> {
        return this.userRepository.getUser(strategy, email).then(user => {
            if (user) {
                user.addSession(token);
                return this.userRepository.saveUser(user);
            }
            else {
                return Promise.reject(`User ${email} not found.`);
            }
        });
    }

    findUser(strategy: AuthStrategy, email: string): Promise<IUser | null> {
        return this.userRepository.getUser(strategy, email);
    }

    abstract forgotPass(strategy: AuthStrategy, email: string, protocol: string): Promise<string>;

    abstract resetPass(strategy: AuthStrategy, email: string, token: string, password: string): Promise<void>;
}
