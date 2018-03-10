import { Container } from 'inversify';

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
import { AuthService } from '../../service/auth/auth.service';
import { IAuthService } from '../../service/auth/auth.service.interface';
import { UserService } from '../../service/user/user.service';
import { IUserService } from '../../service/user/user.service.interface';

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
        // providers
        container.bind<ICryptoProvider>(TYPES.CryptoProvider).to(CryptoProvider).inSingletonScope();
        container.bind<IDateProvider>(TYPES.DateProvider).to(MomentDateProvider).inSingletonScope();
        if (settings.useLocalEmail) {
            container.bind<IEmailProvider>(TYPES.EmailProvider).to(LocalEmailProvider).inSingletonScope();
        }
        else {
            container.bind<IEmailProvider>(TYPES.EmailProvider).to(SendGridEmailProvider).inSingletonScope();
        }
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
        return container;
    }
}
