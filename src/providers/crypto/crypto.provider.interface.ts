export interface ICryptoProvider {
    hashPassword(password: string, algorithm?: string): IPassword;
    verifyPassword(password: string, hashInfo: IPassword, algorithm?: string): boolean;
    encrypt(plaintext: string, algorithm?: string): string;
    decrypt(encrypted: string, algorithm?: string): string;
}

export interface IPassword {
    hash: string;
    salt: string;
}
