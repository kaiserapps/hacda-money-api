export interface ICryptoProvider {
    hashPassword(password: string, algorithm?: string): IPasswordData;
    verifyPassword(password: string, hashInfo: IPasswordData, algorithm?: string): boolean;
    encrypt(plaintext: string, algorithm?: string): string;
    decrypt(encrypted: string, algorithm?: string): string;
}

export interface IPasswordData {
    hash: string;
    salt: string;
}
