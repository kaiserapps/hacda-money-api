import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';

export class Password {
    private _cryptoProvider: ICryptoProvider;
    private _hash: string;
    private _salt: string;

    get hash(): string {
        return this._hash;
    }

    get salt(): string {
        return this._salt;
    }

    static create(
        cryptoProvider: ICryptoProvider,
        password: string
    ): Password {
        const hashInfo = cryptoProvider.hashPassword(password);
        const pass = new Password();
        pass._cryptoProvider = cryptoProvider;
        pass._hash = hashInfo.hash;
        pass._salt = hashInfo.salt;
        return pass;
    }

    verify(password: string): boolean {
        return this._cryptoProvider.verifyPassword(password, {
            hash: this._hash,
            salt: this._salt
        });
    }
}
