export class IEnvironment {
    environment?: string;
    httpPort?: number;
    httpsPort?: number;
    allowHttp?: boolean;
    keyFile?: string;
    certFile?: string;
    url?: string;
    clientUrl?: string;
    useInMemoryDb?: boolean;
    connectionString?: string;
    encryptionKey?: string;
    facebookClientId?: string;
    facebookClientSecret?: string;
    githubClientId?: string;
    githubClientSecret?: string;
    googleClientId?: string;
    googleClientSecret?: string;
    resetPassTokenExpiration?: number;
    useLocalEmail?: boolean;
    localEmailPath?: string;
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
