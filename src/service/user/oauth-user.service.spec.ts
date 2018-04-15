import * as TypeMoq from 'typemoq';
import * as uuid4 from 'uuid/v4';

import { NullPassword } from '../../domain/user/password';
import { User } from '../../domain/user/user';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { IEnvironment } from '../../environments/env.interface';
import { AuthStrategy } from '../../providers/auth/enums';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { OAuthUserService } from './oauth-user.service';

const Mock = TypeMoq.Mock;
const It = TypeMoq.It;
const Times = TypeMoq.Times;

describe('user service', () => {
    let env: TypeMoq.IMock<IEnvironment>;
    let userRepo: TypeMoq.IMock<IUserRepository>;
    let cryptoProv: TypeMoq.IMock<ICryptoProvider>;
    let dateProv: TypeMoq.IMock<IDateProvider>;

    beforeAll(() => {
        env = Mock.ofType<IEnvironment>();
        userRepo = Mock.ofType<IUserRepository>();
        cryptoProv = Mock.ofType<ICryptoProvider>();
        dateProv = Mock.ofType<IDateProvider>();
    });

    describe('register oauth', () => {

        it('creates user on repository', async done => {
            // Arrange
            const userService = new OAuthUserService(env.object, userRepo.object, cryptoProv.object, dateProv.object);
            const user = User.Fixture({
                id: uuid4(),
                strategy: AuthStrategy.Facebook,
                email: 'test@test.com',
                displayName: 'Test User',
                password: new NullPassword()
            });
            userRepo.setup(x => x.initUser(It.isAnyNumber(), It.isAnyString(), It.isAnyString(), It.isAny())).returns(() => Promise.resolve(user)).verifiable();
            userRepo.setup(x => x.createUser(It.isAnyObject<User>(User))).returns(() => Promise.resolve()).verifiable();
            userRepo.setup(x => x.getUser(It.isAnyNumber(), It.isAnyString())).returns(() => Promise.resolve(null)).verifiable();

            try {
                // Act
                await userService.registerUser(AuthStrategy.Facebook, 'test@test.com', 'Test User');

                // Assert
                userRepo.verify(x => x.createUser(user), Times.once());
                done();
            }
            catch (err) {
                fail(err);
                done();
            }
        });
    });
});
