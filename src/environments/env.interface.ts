export class IEnvironment {
    environment?: string;
    port?: number;
    useInMemoryDb?: boolean;
    connectionString?: string;
    encryptionKey?: string;
    facebookClientId?: string;
    facebookClientSecret?: string;
    googleClientId?: string;
    googleClientSecret?: string;
    jwt?: {
        cookieName?: string;
        tokenExpiration?: number;
        audiences?: string[];
        audience?: string;
        issuer?: string;
        privateKeyPath?: string;
        publicKeyPath?: string
    };
}
