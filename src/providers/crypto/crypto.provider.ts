import * as crypto from 'crypto';
import { inject, injectable } from 'inversify';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { ICryptoProvider, IPasswordData } from './crypto.provider.interface';

@injectable()
export class CryptoProvider implements ICryptoProvider {
    constructor(
        @inject(TYPES.Environment) public environment: IEnvironment
    ) { }

    public hashPassword(password: string, algorithm: string = 'sha512'): IPasswordData {
        const salt = this.genRandomString(8);
        const hash = crypto.createHmac(algorithm, salt);
        hash.update(password);
        return {
            salt: salt,
            hash: hash.digest('hex')
        };
    }

    public verifyPassword(password: string, hashInfo: IPasswordData, algorithm: string = 'sha512'): boolean {
        const hash = crypto.createHmac(algorithm, hashInfo.salt);
        hash.update(password);
        return hash.digest('hex') === hashInfo.hash;
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
