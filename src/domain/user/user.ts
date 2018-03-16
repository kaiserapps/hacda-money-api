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

export class IUser {
    id: string;
    strategy: AuthStrategy;
    email: string;
    displayName: string;
    password: Password;
    resetToken?: string;
    resetTokenExpirationDate?: number;
    locked?: boolean;
    oAuthData?: any;
    roles?: RoleType[];
    tokens?: string[];
}

export class User implements IUser {
    _id: string;
    private _strategy: AuthStrategy;
    private _email: string;
    private _displayName: string;
    private _password: Password;
    private _resetToken?: string;
    private _resetTokenExpirationDate?: number;
    private _locked: boolean;
    oAuthData?: any;
    roles: RoleType[];
    tokens: string[];

    get id(): string {
        return this._id;
    }

    get strategy(): AuthStrategy {
        return this._strategy;
    }

    get email(): string {
        return this._email;
    }

    get displayName(): string {
        return this._displayName;
    }

    get password(): Password {
        return this._password;
    }

    get resetToken(): string | undefined {
        return this._resetToken;
    }

    get resetTokenExpirationDate(): number | undefined {
        return this._resetTokenExpirationDate;
    }

    get locked(): boolean {
        return this._locked;
    }

    private constructor() {
        this.roles = [];
    }

    static register(
        userRepository: IUserRepository,
        strategy: AuthStrategy,
        email: string,
        displayName: string,
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
                user._displayName = displayName;
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
        if (token === this._resetToken &&
            dateProvider.currentDateTicks > (this._resetTokenExpirationDate || 0)) {
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

    static Fixture(data: IUser): User {
        const u = new User();
        u._id = data.id;
        u._strategy = data.strategy;
        u._email = data.email;
        u._displayName = data.displayName;
        u._resetToken = data.resetToken;
        u._password = data.password;
        u._locked = data.locked || false;
        u.oAuthData = data.oAuthData;
        u.roles = data.roles || [];
        u.tokens = data.tokens || [];
        return u;
    }
}
