import './api/controllers/foo.controller';
import './polyfills';

import * as bodyParser from 'body-parser';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as mongoose from 'mongoose';

import { CustomAuthProvider } from './api/middleware/custom-auth.provider';
import { LoggingMiddleware } from './api/middleware/logging.middleware';
import { InMemoryDb } from './domain/in-memory.db';
import { UserMemoryRepository } from './domain/user/user.memory.repository';
import { UserMongoRepository, UserSchema } from './domain/user/user.mongo.repository';
import { IUserRepository } from './domain/user/user.repository.interface';
import { IEnvironment } from './environments/env.interface';
import { TYPES } from './ioc.types';
import { CryptoProvider } from './providers/crypto/crypto.provider';
import { ICryptoProvider } from './providers/crypto/crypto.provider.interface';
import { AuthService } from './service/auth/auth.service';
import { IAuthService } from './service/auth/auth.service.interface';
import { UserService } from './service/user/user.service';
import { IUserService } from './service/user/user.service.interface';

const mergeEnvironments = (mainEnv: any, updatedEnv: any): any => {
    for (const e in updatedEnv) {
        if (updatedEnv.hasOwnProperty(e)) {
            mainEnv[e] = updatedEnv[e];
        }
    }
    return mainEnv;
}

// Pull in environment variables
const env = (process.env.NODE_ENVIRONMENT || 'development').toLowerCase();
let environment = require(`./environments/env.js`).environment || {};
environment = mergeEnvironments(environment, (require(`./environments/env.${env}.js`).environment || {}));
const settings: IEnvironment = {
    environment: env,
    port: environment.port || 3000,
    useInMemoryDb: environment.useInMemoryDb || false,
    connectionString: environment.connectionString,
    encryptionKey: environment.encryptionKey || process.env.ENCRYPTION_KEY,
    facebookClientId: environment.facebookClientId || process.env.FACEBOOK_CLIENT_ID || '',
    facebookClientSecret: environment.facebookClientSecret || process.env.FACEBOOK_CLIENT_SECRET || '',
    googleClientId: environment.googleClientId || process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: environment.googleClientSecret || process.env.GOOGLE_CLIENT_SECRET || ''
};
if (environment.jwt) {
    settings.jwt = {
        cookieName: environment.jwt.cookieName || 'HACDA_jwt',
        tokenExpiration: environment.jwt.tokenExpiration || 60 * 60 * 24 * 365, // one year
        audiences: environment.jwt.audiences || [],
        audience: environment.jwt.audience || null,
        issuer: environment.jwt.issuer || null,
        privateKeyPath: environment.jwt.privateKeyPath,
        publicKeyPath: environment.jwt.publicKeyPath
    };
}

// declare metadata by @controller annotation
// set up container
const container = new Container();

// set up bindings
// consts/static
container.bind<any>(TYPES.Environment).toConstantValue(settings);
if (settings.useInMemoryDb) {
    container.bind<InMemoryDb>(TYPES.InMemoryDb).toConstantValue(new InMemoryDb());
}
// middleware
container.bind<LoggingMiddleware>(TYPES.LoggingMiddleware).to(LoggingMiddleware).inRequestScope();
// providers
container.bind<ICryptoProvider>(TYPES.CryptoProvider).to(CryptoProvider).inSingletonScope();
// repositories
if (settings.useInMemoryDb) {
    container.bind<IUserRepository>(TYPES.UserRepository).to(UserMemoryRepository).inRequestScope();
}
else {
    container.bind<IUserRepository>(TYPES.UserRepository).to(UserMongoRepository).inRequestScope();
}
// services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inRequestScope();
container.bind<IUserService>(TYPES.UserService).to(UserService).inRequestScope();

// setup schemas
mongoose.model('User', new mongoose.Schema(UserSchema));

// create server
const server = new InversifyExpressServer(
    container, null, null, null, CustomAuthProvider
);
server.setConfig(a => {
    // add body parser
    a.use(bodyParser.urlencoded({
        extended: true
    }));
    a.use(bodyParser.json());
});
const app = server.build();

// initialize mongoose and then run server
(mongoose as any).Promise = global.Promise;
const mongooseConnect = () => {
    mongoose.connect(environment.connectionString, {
        useMongoClient: true
    }).then(() => {
        try {
            app.listen(settings.port);
        }
        catch (err) {
            console.error(`Failed to listen on port ${settings.port}. Set the environment variable PORT to run on a different port.`)
        }

        console.log(`REST API server started on: ${settings.port}`);
    }).catch(() => {
        console.warn('Failed to connect to MongooseDB. Retrying...');
        setTimeout(mongooseConnect, 5000);
    });
};
mongooseConnect();
