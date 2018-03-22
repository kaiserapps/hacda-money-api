import { inject, injectable } from 'inversify';

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
export class UserService implements IUserService {

    constructor(
        @inject(TYPES.Environment) public environment: IEnvironment,
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(TYPES.CryptoProvider) private cryptoProvider: ICryptoProvider,
        @inject(TYPES.DateProvider) private dateProvider: IDateProvider,
        @inject(TYPES.EmailProvider) private emailProvider: IEmailProvider,
    ) { }

    registerBasicUser(strategy: AuthStrategy, email: string, displayName: string, protocol: string): Promise<UserResponse> {
        return User.register(this.userRepository, strategy, email, displayName).then(user => {
            return this.userRepository.createUser(user).then(() => {
                console.log(user);
                const resetToken = user.initiatePasswordReset(this.dateProvider, this.environment);
                return this.setPasswordResetTokenAndSendEmail(user, resetToken, protocol, true)
                    .then(() => new UserResponse(user));
            });
        });
    }

    registerOAuthUser(strategy: AuthStrategy, email: string, displayName: string, oAuthData?: any): Promise<UserResponse> {
        return User.register(this.userRepository, strategy, email, displayName, oAuthData).then(user => {
            return this.userRepository.createUser(user).then(() => new UserResponse(user));
        });
    }

    addSession(strategy: AuthStrategy, email: string, token: string): Promise<void> {
        return this.userRepository.getUser(strategy, email).then(user => {
            if (user) {
                if (!user.tokens) {
                    user.tokens = [];
                }
                user.tokens.push(token);
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

    forgotPass(strategy: AuthStrategy, email: string, protocol: string): Promise<string> {
        return this.userRepository.getUser(strategy, email).then(user => {
            if (user) {
                const expiration = this.environment.resetPassTokenExpiration || ONE_DAY_IN_SECONDS;
                const resetToken = user.initiatePasswordReset(this.dateProvider, this.environment);
                return this.setPasswordResetTokenAndSendEmail(user, resetToken, protocol).then(() => resetToken);
            }
            else {
                return Promise.reject(`User ${email} not found.`);
            }
        });
    }

    resetPass(strategy: AuthStrategy, email: string, token: string, password: string): Promise<void> {
        return this.userRepository.getUser(strategy, email).then(user => {
            if (user) {
                return user.resetPassword(this.dateProvider, token, Password.create(this.cryptoProvider, password));
            }
            else {
                return Promise.reject(`User ${email} not found.`);
            }
        });
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
