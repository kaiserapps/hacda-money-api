import { IEnvironment } from '../../environments/env.interface';
import * as CONSTS from '../../global-const';
import * as path from 'path';

export class EnvironmentConfig {
    static Configure(env: NodeJS.ProcessEnv, rootDir: string, configDir: string) {
        const envName = (env.NODE_ENVIRONMENT || 'development').toLowerCase();
        const mainConfigFile = path.join(rootDir, configDir, 'env.js');
        const envConfigFile = path.join(rootDir, configDir, `env.${envName}.js`);

        const mainEnv = require(mainConfigFile).environment as IEnvironment || {};
        const envEnv = require(envConfigFile).environment as IEnvironment || {};
        const environment = EnvironmentConfig.mergeEnvironments(mainEnv, envEnv);

        const settings: IEnvironment = {
            environment: envName,
            httpPort: environment.httpPort || 3000,
            httpsPort: environment.httpsPort || 3443,
            allowHttp: environment.allowHttp || false,
            keyFile: EnvironmentConfig.getAbsolutePath(rootDir, environment.keyFile),
            certFile: EnvironmentConfig.getAbsolutePath(rootDir, environment.certFile),
            url: environment.url,
            clientUrl: environment.clientUrl,
            useInMemoryDb: environment.useInMemoryDb || false,
            connectionString: environment.connectionString,
            encryptionKey: environment.encryptionKey || env.ENCRYPTION_KEY,
            facebookClientId: environment.facebookClientId || env.FACEBOOK_CLIENT_ID || '',
            facebookClientSecret: environment.facebookClientSecret || env.FACEBOOK_CLIENT_SECRET || '',
            githubClientId: environment.githubClientId || env.GITHUB_CLIENT_ID || '',
            githubClientSecret: environment.githubClientSecret || env.GITHUB_CLIENT_SECRET || '',
            googleClientId: environment.googleClientId || env.GOOGLE_CLIENT_ID || '',
            googleClientSecret: environment.googleClientSecret || env.GOOGLE_CLIENT_SECRET || '',
            resetPassTokenExpiration: environment.resetPassTokenExpiration || CONSTS.ONE_DAY_IN_SECONDS,
            useLocalEmail: environment.useLocalEmail || false,
            localEmailPath: EnvironmentConfig.getAbsolutePath(rootDir, environment.localEmailPath),
            emailFrom: environment.emailFrom || 'noreply',
            sendGridApiKey: environment.sendGridApiKey || env.SEND_GRID_API_KEY,
            sendGridTemplates: environment.sendGridTemplates || {}
        };
        if (environment.jwt) {
            settings.jwt = {
                cookieName: environment.jwt.cookieName || 'HACDA_jwt',
                tokenExpiration: environment.jwt.tokenExpiration || CONSTS.ONE_YEAR_IN_SECONDS,
                audiences: environment.jwt.audiences || [],
                audience: environment.jwt.audience,
                issuer: environment.jwt.issuer,
                privateKeyPath: EnvironmentConfig.getAbsolutePath(rootDir, environment.jwt.privateKeyPath),
                publicKeyPath: EnvironmentConfig.getAbsolutePath(rootDir, environment.jwt.publicKeyPath)
            };
        }

        return settings;
    }

    private static getAbsolutePath(rootDir: string, relativePath?: string): string {
        return relativePath ? relativePath.length && relativePath[0] === '/' ? relativePath : path.join(rootDir, relativePath) : '';
    }

    private static mergeEnvironments = (mainEnv: any, updatedEnv: any): any => {
        for (const e in updatedEnv) {
            if (updatedEnv.hasOwnProperty(e)) {
                if (!mainEnv[e] || typeof updatedEnv[e] !== 'object') {
                    mainEnv[e] = updatedEnv[e];
                }
                else {
                    mainEnv[e] = EnvironmentConfig.mergeEnvironments(mainEnv[e], updatedEnv[e]);
                }
            }
        }
        return mainEnv;
    }
}
