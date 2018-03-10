import * as uuid from 'uuid/v4';

import { IEnvironment } from '../../environments/env.interface';
import { AuthStrategy } from '../../providers/auth/enums';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IEmailProvider } from '../../providers/email/email.provider.interface';
import { RoleType } from './enums';
import { Password } from './password';
import { IUserRepository } from './user.repository.interface';
import { ONE_DAY_IN_SECONDS } from '../../global-const';

export class User {
    _id: string;
    private _strategy: AuthStrategy;
    private _email: string;
    private _givenName: string;
    private _familyName: string;
    private _password: Password;
    private _resetToken: string;
    private _resetTokenExpirationDate: number;
    locked: boolean;
    oAuthData: any;
    roles: RoleType[];
    tokens: string[];

    get strategy(): AuthStrategy {
        return this._strategy;
    }

    get email(): string {
        return this._email;
    }

    get givenName(): string {
        return this._givenName;
    }

    get familyName(): string {
        return this._familyName;
    }

    get resetToken(): string {
        return this._resetToken;
    }

    get password(): Password {
        return this._password;
    }

    constructor() {
        this.roles = [];
    }

    static register(
        userRepository: IUserRepository,
        strategy: AuthStrategy,
        email: string,
        familyName: string,
        givenName: string,
        oAuthData?: any
    ): Promise<User> {
        return userRepository.getUser(email).then(existingUser => {
            if (!!existingUser) {
                throw new Error(`User with email ${email} already exists.`);
            }
            else {
                const user = new User();
                user._strategy = strategy;
                user._email = email;
                user._familyName = familyName;
                user._givenName = givenName;
                user.oAuthData = oAuthData;
                return user;
            }
        });
    }

    initiatePasswordReset(dateProvider: IDateProvider, environment: IEnvironment): string {
        const expiration = environment.resetPassTokenExpiration || ONE_DAY_IN_SECONDS;
        this._resetToken = uuid();
        this._resetTokenExpirationDate = dateProvider.currentDateTicks + (expiration * 1000);
        return this._resetToken;
    }

    resetPassword(dateProvider: IDateProvider, token: string, password: Password): Promise<void> {
        if (token === this._resetToken || dateProvider.currentDateTicks > this._resetTokenExpirationDate) {
            this._password = password;
            return Promise.resolve();
        }
        else {
            return Promise.reject('Reset token incorrect or expired.');
        }
    }

    addRole(type: RoleType) {
        if (!this.roles.find(rt => rt === type)) {
            this.roles.push(type);
        }
    }

    removeRole(type: RoleType) {
        const idx = this.roles.findIndex(rt => rt === type);
        if (idx > -1) {
            this.roles.splice(idx, 1);
        }
    }
}
