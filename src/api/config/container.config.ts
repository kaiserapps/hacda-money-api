import * as fs from 'fs';
import { Container } from 'inversify';

import { AuditMemoryRepository } from '../../domain/audit/audit.memory.repository';
import { AuditMongoRepository } from '../../domain/audit/audit.mongo.repository';
import { IAuditRepository } from '../../domain/audit/audit.repository.interface';
import { InMemoryDb } from '../../domain/in-memory.db';
import { UserMemoryRepository } from '../../domain/user/user.memory.repository';
import { UserMongoRepository } from '../../domain/user/user.mongo.repository';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { CryptoProvider } from '../../providers/crypto/crypto.provider';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { MomentDateProvider } from '../../providers/date/moment-date.provider';
import { IEmailProvider } from '../../providers/email/email.provider.interface';
import { LocalEmailProvider } from '../../providers/email/local-email.provider';
import { SendGridEmailProvider } from '../../providers/email/sendgrid-email.provider';
import { UserProvider } from '../../providers/user/user.provider';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { AuthService } from '../../service/auth/auth.service';
import { IAuthService } from '../../service/auth/auth.service.interface';
import { UserService } from '../../service/user/user.service';
import { IUserService } from '../../service/user/user.service.interface';
import { AuthorizeMiddleware } from '../middleware/authorize.middleware';
import { FacebookAuthMiddleware } from '../middleware/facebook-auth.middleware';
import { GithubAuthMiddleware } from '../middleware/github-auth.middleware';
import { GoogleAuthMiddleware } from '../middleware/google-auth.middleware';
import { OAuthSuccessMiddleware } from '../middleware/oauth-success.middleware';

export class ContainerConfig {
    static Configure(settings: IEnvironment) {
        // set up container
        const container = new Container();

        // set up bindings
        // consts/static
        container.bind<IEnvironment>(TYPES.Environment).toConstantValue(settings);
        if (settings.useInMemoryDb) {
            container.bind<InMemoryDb>(TYPES.InMemoryDb).toConstantValue(new InMemoryDb());
        }
        // middleware
        container.bind<AuthorizeMiddleware>(TYPES.AuthorizeMiddleware).to(AuthorizeMiddleware).inRequestScope();
        container.bind<FacebookAuthMiddleware>(TYPES.FacebookAuthMiddleware).to(FacebookAuthMiddleware).inRequestScope();
        container.bind<GithubAuthMiddleware>(TYPES.GithubAuthMiddleware).to(GithubAuthMiddleware).inRequestScope();
        container.bind<GoogleAuthMiddleware>(TYPES.GoogleAuthMiddleware).to(GoogleAuthMiddleware).inRequestScope();
        container.bind<OAuthSuccessMiddleware>(TYPES.OAuthSuccessMiddleware).to(OAuthSuccessMiddleware).inRequestScope();
        // providers
        container.bind<ICryptoProvider>(TYPES.CryptoProvider).to(CryptoProvider).inSingletonScope();
        container.bind<IDateProvider>(TYPES.DateProvider).to(MomentDateProvider).inSingletonScope();
        if (settings.useLocalEmail && settings.localEmailPath) {
            if (!fs.existsSync(settings.localEmailPath)) {
                fs.mkdirSync(settings.localEmailPath);
            }
            container.bind<IEmailProvider>(TYPES.EmailProvider).to(LocalEmailProvider).inSingletonScope();
        }
        else {
            container.bind<IEmailProvider>(TYPES.EmailProvider).to(SendGridEmailProvider).inSingletonScope();
        }
        container.bind<IUserProvider>(TYPES.UserProvider).to(UserProvider).inSingletonScope();
        // repositories
        if (settings.useInMemoryDb) {
            container.bind<IAuditRepository>(TYPES.AuditRepository).to(AuditMemoryRepository).inRequestScope();
            container.bind<IUserRepository>(TYPES.UserRepository).to(UserMemoryRepository).inRequestScope();
        }
        else {
            container.bind<IAuditRepository>(TYPES.AuditRepository).to(AuditMongoRepository).inRequestScope();
            container.bind<IUserRepository>(TYPES.UserRepository).to(UserMongoRepository).inRequestScope();
        }
        // services
        container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inRequestScope();
        container.bind<IUserService>(TYPES.UserService).to(UserService).inRequestScope();
        return container;
    }
}
