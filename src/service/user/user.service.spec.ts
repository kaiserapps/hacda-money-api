import * as TypeMoq from 'typemoq';

import { User } from '../../domain/user/user';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { UserService } from './user.service';
import { IEnvironment } from '../../environments/env.interface';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IEmailProvider } from '../../providers/email/email.provider.interface';
import { AuthStrategy } from '../../providers/auth/enums';

describe('user service', () => {
    let env: TypeMoq.IMock<IEnvironment>;
    let userRepo: TypeMoq.IMock<IUserRepository>;
    let cryptoProv: TypeMoq.IMock<ICryptoProvider>;
    let dateProv: TypeMoq.IMock<IDateProvider>;
    let emailProv: TypeMoq.IMock<IEmailProvider>;

    beforeAll(() => {
        env = TypeMoq.Mock.ofType<IEnvironment>();
        userRepo = TypeMoq.Mock.ofType<IUserRepository>();
        cryptoProv = TypeMoq.Mock.ofType<ICryptoProvider>();
        dateProv = TypeMoq.Mock.ofType<IDateProvider>();
        emailProv = TypeMoq.Mock.ofType<IEmailProvider>();
    });
    describe('register oauth', () => {
        it('creates user on repository', done => {
            // Arrange
            const anyUser = TypeMoq.It.isAnyObject<User>(User);
            userRepo.setup(x => x.createUser(anyUser))
                .returns(() => Promise.resolve());
            userRepo.setup(x => x.getUser(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyString()))
                .returns(() => Promise.resolve(null));

            const userService = new UserService(
                env.object,
                userRepo.object,
                cryptoProv.object,
                dateProv.object,
                emailProv.object
            );

            // Act
            userService.registerOAuthUser(AuthStrategy.Facebook, 'test@test.com', 'Test User').then(user => {
                // Assert
                userRepo.verify(x => x.createUser(anyUser), TypeMoq.Times.once());
                done();
            });
        });
    });
});
