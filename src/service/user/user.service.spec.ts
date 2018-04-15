import * as TypeMoq from 'typemoq';

import { IUser, User } from '../../domain/user/user';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { IEnvironment } from '../../environments/env.interface';
import { AuthStrategy } from '../../providers/auth/enums';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { BasicUserService } from './basic-user.service';
import { IUserPasswordService } from './user-password.service.interface';

const Mock = TypeMoq.Mock;
const It = TypeMoq.It;
const Times = TypeMoq.Times;

describe('user service', () => {
    let env: TypeMoq.IMock<IEnvironment>;
    let userRepo: TypeMoq.IMock<IUserRepository>;
    let cryptoProv: TypeMoq.IMock<ICryptoProvider>;
    let dateProv: TypeMoq.IMock<IDateProvider>;
    let passSvc: TypeMoq.IMock<IUserPasswordService>;

    beforeAll(() => {
        env = Mock.ofType<IEnvironment>();
        userRepo = Mock.ofType<IUserRepository>();
        cryptoProv = Mock.ofType<ICryptoProvider>();
        dateProv = Mock.ofType<IDateProvider>();
        passSvc = Mock.ofType<IUserPasswordService>();
    });

    describe('adding session', () => {

        it('pushes a new token on successful retrieve of user', async done => {
            // Arrange
            const userService = new BasicUserService(env.object, userRepo.object, cryptoProv.object, dateProv.object, passSvc.object);
            const mockUser = Mock.ofType<IUser>();
            mockUser.setup((x: any) => x.then).returns(() => undefined);
            mockUser.setup(x => x.addSession(It.isAnyString())).verifiable();
            userRepo.setup(x => x.getUser(It.isAnyNumber(), It.isAnyString())).returns(() => Promise.resolve(mockUser.object)).verifiable();
            userRepo.setup(x => x.saveUser(It.isAnyObject<User>(User))).returns(() => Promise.resolve()).verifiable();

            try {
                // Act
                const token = 'testtoken';
                const email = 'test@test.com';
                await userService.addSession(AuthStrategy.Basic, email, token);

                // Assert
                userRepo.verify(x => x.getUser(AuthStrategy.Basic, email), Times.once());
                mockUser.verify(x => x.addSession(token), Times.once());
                userRepo.verify(x => x.saveUser(mockUser.object), Times.once());
                done();
            }
            catch (err) {
                fail(err);
            }
        });

        it('does not create user if registration failed', async done => {
            // Arrange
            const userService = new BasicUserService(env.object, userRepo.object, cryptoProv.object, dateProv.object, passSvc.object);
            const anyUser = It.isAnyObject<User>(User);
            const expectedError = 'initUserError';
            userRepo.setup(x => x.initUser(It.isAnyNumber(), It.isAnyString(), It.isAnyString(), It.isAny())).returns(() => Promise.reject(expectedError)).verifiable();
            userRepo.setup(x => x.createUser(anyUser)).returns(() => Promise.resolve()).verifiable();

            try {
                // Act
                await userService.registerUser(AuthStrategy.Basic, 'test@test.com', 'Test User');
                fail('unexpected promise resolve');
                done();
            }
            catch (err) {
                // Assert
                userRepo.verify(x => x.createUser(anyUser), Times.never());
                expect(err).toEqual(expectedError);
                done();
            };
        });
    });
});
