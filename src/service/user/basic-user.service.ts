import { inject, injectable } from 'inversify';

import { Password } from '../../domain/user/password';
import { IUser, User } from '../../domain/user/user';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { IEnvironment } from '../../environments/env.interface';
import { ONE_DAY_IN_SECONDS } from '../../global-const';
import { TYPES } from '../../ioc.types';
import { AuthStrategy } from '../../providers/auth/enums';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IEmail, IEmailProvider } from '../../providers/email/email.provider.interface';
import { UserResponse } from './user-response';
import { UserService } from './user.service';
import { IUserService } from './user.service.interface';
import { IUserPasswordService } from './user-password.service.interface';

@injectable()
export class BasicUserService extends UserService implements IUserService {
    constructor(
        @inject(TYPES.Environment) environment: IEnvironment,
        @inject(TYPES.UserRepository) userRepository: IUserRepository,
        @inject(TYPES.CryptoProvider) cryptoProvider: ICryptoProvider,
        @inject(TYPES.DateProvider) dateProvider: IDateProvider,
        @inject(TYPES.UserPasswordService) private passwordService: IUserPasswordService
    ) {
        super(environment, userRepository, cryptoProvider, dateProvider);
    }

    async registerUser(strategy: AuthStrategy, email: string, displayName: string): Promise<UserResponse> {
        const user = await super.initAndCreateUser(strategy, email, displayName);
        await this.passwordService.resetPassword(user, true);
        return new UserResponse(user);
    }

    async forgotPass(strategy: AuthStrategy, email: string): Promise<string> {
        const user = await this.userRepository.getUser(strategy, email);
        if (user) {
            const expiration = this.environment.resetPassTokenExpiration || ONE_DAY_IN_SECONDS;
            return this.passwordService.resetPassword(user);
        }
        else {
            throw new Error(`User ${email} not found.`);
        }
    }

    async resetPass(strategy: AuthStrategy, email: string, token: string, password: string): Promise<void> {
        const user = await this.userRepository.getUser(strategy, email);
        if (user) {
            return user.resetPassword(this.dateProvider, token, Password.create(this.cryptoProvider, password));
        }
        else {
            throw new Error(`User ${email} not found.`);
        }
    }
}
