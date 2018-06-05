import * as uuid from 'uuid/v4';

import { IEnvironment } from '../../environments/env.interface';
import { ONE_DAY_IN_SECONDS } from '../../global-const';
import { AuthStrategy } from '../../providers/auth/enums';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { RoleType } from './enums';
import { IPassword, NullPassword } from './password';
import { IUserRepository } from './user.repository.interface';

export interface IUserData {
    id: string;
    strategy: AuthStrategy;
    email: string;
    displayName: string;
    password: IPassword;
    resetToken?: string;
    resetTokenExpirationDate?: number;
    locked?: boolean;
    oAuthData?: any;
    roles?: RoleType[];
    tokens?: string[];
}

export interface IUser extends IUserData {
    initiatePasswordReset(dateProvider: IDateProvider, environment: IEnvironment): string;
    resetPassword(dateProvider: IDateProvider, token: string, password: IPassword): void;
    addRole(type: RoleType): void;
    removeRole(type: RoleType): void;
    addSession(token: string): void;
}

export class User implements IUser {
    private _id: string;
    private _strategy: AuthStrategy;
    private _email: string;
    private _displayName: string;
    private _password: IPassword;
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

    get password(): IPassword {
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

    public constructor() {
        this._password = new NullPassword();
        this.roles = [];
    }

    static async register(
        userRepository: IUserRepository,
        strategy: AuthStrategy,
        email: string,
        displayName: string,
        oAuthData?: any
    ): Promise<IUser> {
        const existingUser = await userRepository.getUser(strategy, email);
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
    }

    initiatePasswordReset(dateProvider: IDateProvider, environment: IEnvironment): string {
        const expiration = environment.resetPassTokenExpiration || ONE_DAY_IN_SECONDS;
        this._resetToken = uuid();
        this._resetTokenExpirationDate = dateProvider.currentDateTicks + (expiration * 1000);
        return this._resetToken;
    }

    resetPassword(dateProvider: IDateProvider, token: string, password: IPassword): void {
        if (token === this._resetToken &&
            dateProvider.currentDateTicks > (this._resetTokenExpirationDate || 0)) {
            this._password = password;
        }
        else {
            throw new Error('Reset token incorrect or expired.');
        }
    }

    addRole(type: RoleType): void {
        if (!this.roles.find(rt => rt === type)) {
            this.roles.push(type);
        }
    }

    removeRole(type: RoleType): void {
        const idx = this.roles.findIndex(rt => rt === type);
        if (idx > -1) {
            this.roles.splice(idx, 1);
        }
    }

    addSession(token: string): void {
        if (!this.tokens) {
            this.tokens = [];
        }
        this.tokens.push(token);
    }

    static Fixture(data: IUserData, id?: string): User {
        const u = new User();
        u._id = id || data.id;
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
