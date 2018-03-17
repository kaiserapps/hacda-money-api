import * as TypeMoq from 'typemoq';

import { User } from '../../domain/user/user';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { IEnvironment } from '../../environments/env.interface';
import { AuthStrategy } from '../../providers/auth/enums';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IEmail, IEmailProvider } from '../../providers/email/email.provider.interface';
import { UserService } from './user.service';
import { IUserService } from './user.service.interface';

describe('user service', () => {
    let env: TypeMoq.IMock<IEnvironment>;
    let userRepo: TypeMoq.IMock<IUserRepository>;
    let cryptoProv: TypeMoq.IMock<ICryptoProvider>;
    let dateProv: TypeMoq.IMock<IDateProvider>;
    let emailProv: TypeMoq.IMock<IEmailProvider>;
    let userService: IUserService;

    beforeEach(() => {
        env = TypeMoq.Mock.ofType<IEnvironment>();
        userRepo = TypeMoq.Mock.ofType<IUserRepository>();
        cryptoProv = TypeMoq.Mock.ofType<ICryptoProvider>();
        dateProv = TypeMoq.Mock.ofType<IDateProvider>();
        emailProv = TypeMoq.Mock.ofType<IEmailProvider>();
        emailProv.setup(x => x.sendEmail(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString(), TypeMoq.It.isAny()))
            .returns(() => Promise.resolve(TypeMoq.It.isAny()));
        userService = new UserService(
            env.object,
            userRepo.object,
            cryptoProv.object,
            dateProv.object,
            emailProv.object
        );
    });

    describe('register basic', () => {

        it('creates user on repository', done => {
            // Arrange
            const anyUser = TypeMoq.It.isAnyObject<User>(User);
            userRepo.setup(x => x.createUser(anyUser))
                .returns(() => Promise.resolve());
            userRepo.setup(x => x.getUser(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyString()))
                .returns(() => Promise.resolve(null));

            // Act
            userService.registerBasicUser(AuthStrategy.Basic, 'test@test.com', 'Test User', 'http').then(user => {

                // Assert
                userRepo.verify(x => x.createUser(anyUser), TypeMoq.Times.once());
                done();
            });
        });
    });

    describe('register oauth', () => {

        it('creates user on repository', done => {
            // Arrange
            const anyUser = TypeMoq.It.isAnyObject<User>(User);
            userRepo.setup(x => x.createUser(anyUser))
                .returns(() => Promise.resolve());
            userRepo.setup(x => x.getUser(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyString()))
                .returns(() => Promise.resolve(null));

            // Act
            userService.registerOAuthUser(AuthStrategy.Facebook, 'test@test.com', 'Test User').then(user => {

                // Assert
                userRepo.verify(x => x.createUser(anyUser), TypeMoq.Times.once());
                done();
            });
        });
    });
});
