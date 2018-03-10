import { inject, injectable } from 'inversify';

import { Password } from '../../domain/user/password';
import { User } from '../../domain/user/user';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { IEnvironment } from '../../environments/env.interface';
import { ONE_DAY_IN_SECONDS } from '../../global-const';
import { TYPES } from '../../ioc.types';
import { AuthStrategy } from '../../providers/auth/enums';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IEmailProvider, IEmail } from '../../providers/email/email.provider.interface';
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

    registerUser(strategy: AuthStrategy, email: string, familyName: string, givenName: string, oAuthData?: any): Promise<UserResponse> {
        return User.register(this.userRepository, strategy, email, familyName, givenName, oAuthData).then(user => {
            return this.userRepository.createUser(user).then(() => {
                if (strategy === AuthStrategy.Basic) {
                    const resetToken = user.initiatePasswordReset(this.dateProvider, this.environment);
                    return this.setPasswordResetTokenAndSendEmail(user, resetToken, true)
                        .then(() => new UserResponse(user));
                }
                else {
                    return new UserResponse(user);
                }
            });
        });
    }

    addSession(email: string, token: string): Promise<void> {
        return this.userRepository.getUser(email).then(user => {
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

    findUser(email: string): Promise<User | null> {
        return this.userRepository.getUser(email);
    }

    forgotPass(email: string): Promise<string> {
        return this.userRepository.getUser(email).then(user => {
            if (user) {
                const expiration = this.environment.resetPassTokenExpiration || ONE_DAY_IN_SECONDS;
                const resetToken = user.initiatePasswordReset(this.dateProvider, this.environment);
                return this.setPasswordResetTokenAndSendEmail(user, resetToken).then(() => resetToken);
            }
            else {
                return Promise.reject(`User ${email} not found.`);
            }
        });
    }

    resetPass(email: string, token: string, password: string): Promise<void> {
        return this.userRepository.getUser(email).then(user => {
            if (user) {
                return user.resetPassword(this.dateProvider, token, Password.create(this.cryptoProvider, password));
            }
            else {
                return Promise.reject(`User ${email} not found.`);
            }
        });
    }

    private setPasswordResetTokenAndSendEmail(user: User, resetToken: string, isActivation?: boolean): Promise<IEmail> {
        const action = isActivation ? 'activate your account' : 'reset your password';
        const title = isActivation ? 'Active Account' : 'Reset Password';
        return this.emailProvider.sendEmail(
            user.email,
            title,
            `Please click the following link to ${action}.<br />
            <a href="${this.environment.url}/auth/basic/resetpass/${resetToken}">${title}</a>`,
            'accountManagement',
            {
                'ClientUrl': this.environment.clientUrl
            });
    }
}
