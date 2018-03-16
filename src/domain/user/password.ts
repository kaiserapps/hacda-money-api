import { ICryptoProvider, IPassword } from '../../providers/crypto/crypto.provider.interface';

export class Password implements IPassword {
    private _hash: string;
    private _salt: string;

    get hash(): string {
        return this._hash;
    }

    get salt(): string {
        return this._salt;
    }

    private constructor() { }

    static create(
        cryptoProvider: ICryptoProvider,
        password: string
    ): Password {
        const hashInfo = cryptoProvider.hashPassword(password);
        const pass = new Password();
        pass._hash = hashInfo.hash;
        pass._salt = hashInfo.salt;
        return pass;
    }

    verify(cryptoProvider: ICryptoProvider, password: string): boolean {
        return cryptoProvider.verifyPassword(password, {
            hash: this._hash,
            salt: this._salt
        });
    }

    static Fixture(data: IPassword): Password {
        const p = new Password();
        p._hash = data.hash;
        p._salt = data.salt;
        return p;
    }
}
