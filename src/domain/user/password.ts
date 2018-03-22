import { ICryptoProvider, IPasswordData } from '../../providers/crypto/crypto.provider.interface';

export interface IPassword extends IPasswordData {
    isNull?: boolean;
    verify(cryptoProvider: ICryptoProvider, password: string): boolean;
}

export class Password implements IPassword {
    private _hash = '';
    private _salt = '';

    get hash(): string {
        return this._hash;
    }

    get salt(): string {
        return this._salt;
    }

    get isNull(): boolean {
        return false;
    }

    protected constructor() { }

    static create(
        cryptoProvider: ICryptoProvider,
        password: string
    ): IPassword {
        const hashInfo = cryptoProvider.hashPassword(password);
        const pass = new Password();
        pass._hash = hashInfo.hash;
        pass._salt = hashInfo.salt;
        return pass;
    }

    verify(cryptoProvider: ICryptoProvider, password: string): boolean {
        if (this.isNull) {
            return false;
        }

        return cryptoProvider.verifyPassword(password, {
            hash: this._hash,
            salt: this._salt
        });
    }

    static Fixture(data: IPasswordData): Password {
        const p = new Password();
        p._hash = data.hash;
        p._salt = data.salt;
        return p;
    }
}

export class NullPassword extends Password implements IPassword {
    get isNull(): boolean {
        return true;
    }

    constructor() {
        super();
    }
}
