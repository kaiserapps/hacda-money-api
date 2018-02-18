import * as crypto from 'crypto';
import { inject, injectable } from 'inversify';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { ICryptoProvider } from './crypto.provider.interface';

@injectable()
export class CryptoProvider implements ICryptoProvider {
    constructor(
        @inject(TYPES.Environment) public environment: IEnvironment
    ) { }

    public hashPassword(password: string, algorithm: string = 'sha512'): [string, string] {
        const salt = this.genRandomString(8);
        const hash = crypto.createHmac(algorithm, salt);
        hash.update(password);
        const passwordHash = hash.digest('hex');
        return [salt, passwordHash];
    }

    public verifyPassword(password: string, passwordHash: string, salt: string, algorithm: string = 'sha512'): boolean {
        const hash = crypto.createHmac(algorithm, salt);
        hash.update(password);
        return hash.digest('hex') === passwordHash;
    }

    public encrypt(plaintext: string, algorithm: string = 'des3'): string {
        const cipher = crypto.createCipher(algorithm, this.environment.encryptionKey);
        let encrypted = cipher.update(plaintext, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    public decrypt(encrypted: string, algorithm: string = 'des3'): string {
        const decipher = crypto.createDecipher(algorithm, this.environment.encryptionKey);
        let plaintext = decipher.update(encrypted, 'base64', 'utf8');
        plaintext += decipher.final('utf8');
        return plaintext;
    }

    private genRandomString(length: number) {
        return crypto.randomBytes(Math.ceil(length / 2))
                .toString('hex') /** convert to hexadecimal format */
                .slice(0, length);   /** return required number of characters */
    }
}
