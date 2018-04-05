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

@injectable()
export class BasicUserService extends UserService implements IUserService {
    private _httpProtocol: string;

    set httpProtocol(protocol: string) {
        this._httpProtocol = protocol;
    }

    constructor(
        @inject(TYPES.Environment) environment: IEnvironment,
        @inject(TYPES.UserRepository) userRepository: IUserRepository,
        @inject(TYPES.CryptoProvider) cryptoProvider: ICryptoProvider,
        @inject(TYPES.DateProvider) dateProvider: IDateProvider,
        @inject(TYPES.EmailProvider) private emailProvider: IEmailProvider,
    ) {
        super(environment, userRepository, cryptoProvider, dateProvider);
    }

    async registerUser(strategy: AuthStrategy, email: string, displayName: string): Promise<UserResponse> {
        const user = await User.register(this.userRepository, strategy, email, displayName);
        await this.userRepository.createUser(user);
        const resetToken = user.initiatePasswordReset(this.dateProvider, this.environment);
        await this.setPasswordResetTokenAndSendEmail(user, resetToken, this._httpProtocol, true);
        return Promise.resolve(new UserResponse(user));
    }

    async forgotPass(strategy: AuthStrategy, email: string, protocol: string): Promise<string> {
        const user = await this.userRepository.getUser(strategy, email);
        if (user) {
            const expiration = this.environment.resetPassTokenExpiration || ONE_DAY_IN_SECONDS;
            const resetToken = user.initiatePasswordReset(this.dateProvider, this.environment);
            await this.setPasswordResetTokenAndSendEmail(user, resetToken, protocol);
            return Promise.resolve(resetToken);
        }
        else {
            return Promise.reject(`User ${email} not found.`);
        }
    }

    async resetPass(strategy: AuthStrategy, email: string, token: string, password: string): Promise<void> {
        const user = await this.userRepository.getUser(strategy, email);
        if (user) {
            return user.resetPassword(this.dateProvider, token, Password.create(this.cryptoProvider, password));
        }
        else {
            return Promise.reject(`User ${email} not found.`);
        }
    }

    private setPasswordResetTokenAndSendEmail(user: IUser, resetToken: string, protocol: string, isActivation?: boolean): Promise<IEmail> {
        const action = isActivation ? 'activate your account' : 'reset your password';
        const title = isActivation ? 'Active Account' : 'Reset Password';
        return this.emailProvider.sendEmail(
            user.email,
            title,
            `<h1>Congratulations!</h1>` +
            `<h2>Your account was successfully created on: ${protocol}://${this.environment.clientUrl}<h2>` +
            `Please click the following link to ${action}.<br />` +
            `<a href="${protocol}://${this.environment.url}/auth/basic/resetpass/${resetToken}">${title}</a>`,
            'accountManagement',
            {
                'ClientUrl': `${protocol}://${this.environment.clientUrl}`
            });
    }
}
