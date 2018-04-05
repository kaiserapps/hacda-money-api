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
import { UserService } from './user.service';

@injectable()
export class OAuthUserService extends UserService implements IUserService {

    _httpProtocol: string;
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

    forgotPass(strategy: AuthStrategy, email: string, protocol: string): Promise<string> {
        return Promise.reject('Method "forgotPass" not applicable to oauth');
    }

    resetPass(strategy: AuthStrategy, email: string, token: string, password: string): Promise<void> {
        return Promise.reject('Method "resetPass" not applicable to oauth');
    }
}
