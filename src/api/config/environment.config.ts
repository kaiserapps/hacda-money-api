import { IEnvironment } from '../../environments/env.interface';
import * as CONSTS from '../../global-const';
import * as path from 'path';

export class EnvironmentConfig {
    static Configure(env: NodeJS.ProcessEnv, configDir: string) {
        const envName = (env.NODE_ENVIRONMENT || 'development').toLowerCase();
        const mainConfigFile = path.join(configDir, 'env.js');
        const envConfigFile = path.join(configDir, `env.${envName}.js`);

        const mainEnv = require(mainConfigFile).environment as IEnvironment || {};
        const envEnv = require(envConfigFile).environment as IEnvironment || {};
        const environment = EnvironmentConfig.mergeEnvironments(mainEnv, envEnv);

        const settings: IEnvironment = {
            environment: envName,
            port: environment.port || 3000,
            url: environment.url,
            clientUrl: environment.clientUrl,
            useInMemoryDb: environment.useInMemoryDb || false,
            connectionString: environment.connectionString,
            encryptionKey: environment.encryptionKey || env.ENCRYPTION_KEY,
            facebookClientId: environment.facebookClientId || env.FACEBOOK_CLIENT_ID || '',
            facebookClientSecret: environment.facebookClientSecret || env.FACEBOOK_CLIENT_SECRET || '',
            googleClientId: environment.googleClientId || env.GOOGLE_CLIENT_ID || '',
            googleClientSecret: environment.googleClientSecret || env.GOOGLE_CLIENT_SECRET || '',
            resetPassTokenExpiration: environment.resetPassTokenExpiration || CONSTS.ONE_DAY_IN_SECONDS,
            useLocalEmail: environment.useLocalEmail || false,
            localEmailPath: environment.localEmailPath || '',
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
                privateKeyPath: environment.jwt.privateKeyPath,
                publicKeyPath: environment.jwt.publicKeyPath
            };
        }
        return settings;
    }

    private static mergeEnvironments = (mainEnv: any, updatedEnv: any): any => {
        for (const e in updatedEnv) {
            if (updatedEnv.hasOwnProperty(e)) {
                mainEnv[e] = updatedEnv[e];
            }
        }
        return mainEnv;
    }
}
