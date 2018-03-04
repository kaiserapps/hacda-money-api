export class IEnvironment {
    environment?: string;
    port?: number;
    url?: string;
    clientUrl?: string;
    useInMemoryDb?: boolean;
    connectionString?: string;
    encryptionKey?: string;
    facebookClientId?: string;
    facebookClientSecret?: string;
    googleClientId?: string;
    googleClientSecret?: string;
    resetPassTokenExpiration?: number;
    useLocalEmail?: boolean;
    emailFrom?: string;
    sendGridApiKey?: string;
    sendGridTemplates?: { [key: string]: string };
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