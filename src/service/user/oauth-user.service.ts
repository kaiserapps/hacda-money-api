import { inject, injectable } from 'inversify';

import { IUserRepository } from '../../domain/user/user.repository.interface';
import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { AuthStrategy } from '../../providers/auth/enums';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { UserService } from './user.service';
import { IUserService } from './user.service.interface';

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
        @inject(TYPES.DateProvider) dateProvider: IDateProvider
    ) {
        super(environment, userRepository, cryptoProvider, dateProvider);
    }

    forgotPass(strategy: AuthStrategy, email: string, protocol: string): Promise<string> {
        throw new Error('Method "forgotPass" not applicable to oauth');
    }

    resetPass(strategy: AuthStrategy, email: string, token: string, password: string): Promise<void> {
        throw new Error('Method "resetPass" not applicable to oauth');
    }
}
