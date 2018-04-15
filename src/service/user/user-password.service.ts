import { inject, injectable } from 'inversify';

import { IUser } from '../../domain/user/user';
import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IEmailProvider } from '../../providers/email/email.provider.interface';
import { IUserPasswordService } from './user-password.service.interface';

@injectable()
export class UserPasswordService implements IUserPasswordService {
    private _httpProtocol = 'http';

    set httpProtocol(protocol: string) {
        this._httpProtocol = protocol;
    }

    constructor(
        @inject(TYPES.Environment) private environment: IEnvironment,
        @inject(TYPES.DateProvider) private dateProvider: IDateProvider,
        @inject(TYPES.EmailProvider) private emailProvider: IEmailProvider
    ) {
    }

    async resetPassword(user: IUser, isActivation?: boolean): Promise<string> {
        const resetToken = user.initiatePasswordReset(this.dateProvider, this.environment);
        const action = isActivation ? 'activate your account' : 'reset your password';
        const title = isActivation ? 'Active Account' : 'Reset Password';
        await this.emailProvider.sendEmail(
            user.email,
            title,
            `<h1>Congratulations!</h1>` +
            `<h2>Your account was successfully created on: ${this._httpProtocol}://${this.environment.clientUrl}<h2>` +
            `Please click the following link to ${action}.<br />` +
            `<a href="${this._httpProtocol}://${this.environment.url}/auth/basic/resetpass/${resetToken}">${title}</a>`,
            'accountManagement',
            {
                'ClientUrl': `${this._httpProtocol}://${this.environment.clientUrl}`
            });
        return resetToken;
    }
}
