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
        const parts = cryptoProvider.hashPassword(password);
        const pass = new Password();
        pass._cryptoProvider = cryptoProvider;
        pass._hash = parts[0];
        pass._salt = parts[1];
        return pass;
    }

    verify(password: string): boolean {
        return this._cryptoProvider.verifyPassword(password, this._hash, this._salt);
    }
}
