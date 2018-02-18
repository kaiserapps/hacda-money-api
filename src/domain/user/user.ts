import { AuthStrategy } from '../../providers/auth/enums';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { RoleType } from './enums';
import { Password } from './password';

export class User {
    _id: string;
    private _strategy: AuthStrategy;
    private _username: string;
    private _email: string;
    private _givenName: string;
    private _familyName: string;
    private _password: Password;
    locked: boolean;
    oAuthData: any;
    roles: RoleType[];
    tokens: string[];

    get strategy(): AuthStrategy {
        return this._strategy;
    }

    get username(): string {
        return this._username;
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

    get password(): Password {
        return this._password;
    }

    constructor() {
        this.roles = [];
    }

    static register(
        cryptoProvider: ICryptoProvider,
        strategy: AuthStrategy,
        username: string,
        email: string,
        familyName: string,
        givenName: string,
        password?: string,
        oAuthData?: any
    ): User {
        const user = new User();
        user._strategy = strategy;
        user._username = username;
        user._email = email;
        user._familyName = familyName;
        user._givenName = givenName;
        if (password) {
            user._password = Password.create(cryptoProvider, password);
        }
        user.oAuthData = oAuthData;
        return user;
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
