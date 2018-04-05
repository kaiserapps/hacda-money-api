// import * as TypeMoq from 'typemoq';
// import * as uuid4 from 'uuid/v4';

// import { NullPassword, Password } from '../../domain/user/password';
// import { IUser, User } from '../../domain/user/user';
// import { IUserRepository } from '../../domain/user/user.repository.interface';
// import { IEnvironment } from '../../environments/env.interface';
// import { AuthStrategy } from '../../providers/auth/enums';
// import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
// import { IDateProvider } from '../../providers/date/date.provider.interface';
// import { IEmailProvider } from '../../providers/email/email.provider.interface';
// import { UserService } from './user.service';
// import { IUserService } from './user.service.interface';

// describe('user service', () => {
//     let env: TypeMoq.IMock<IEnvironment>;
//     let userRepo: TypeMoq.IMock<IUserRepository>;
//     let cryptoProv: TypeMoq.IMock<ICryptoProvider>;
//     let dateProv: TypeMoq.IMock<IDateProvider>;
//     let emailProv: TypeMoq.IMock<IEmailProvider>;
//     let userService: IUserService;

//     beforeEach(() => {
//         env = TypeMoq.Mock.ofType<IEnvironment>();
//         userRepo = TypeMoq.Mock.ofType<IUserRepository>();
//         cryptoProv = TypeMoq.Mock.ofType<ICryptoProvider>();
//         dateProv = TypeMoq.Mock.ofType<IDateProvider>();
//         emailProv = TypeMoq.Mock.ofType<IEmailProvider>();
//         emailProv.setup(x => x.sendEmail(TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString(), TypeMoq.It.isAny()))
//             .returns(() => Promise.resolve(TypeMoq.It.isAny()));
//         userService = new UserService(
//             env.object,
//             userRepo.object,
//             cryptoProv.object,
//             dateProv.object,
//             emailProv.object
//         );
//     });

//     describe('register basic', () => {

//         it('creates user on repository', done => {
//             // Arrange
//             const anyUser = TypeMoq.It.isAnyObject<User>(User);
//             userRepo.setup(x => x.createUser(anyUser)).returns(() => Promise.resolve()).verifiable();
//             userRepo.setup(x => x.getUser(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyString())).returns(() => Promise.resolve(null)).verifiable();

//             // Act
//             userService.registerBasicUser(AuthStrategy.Basic, 'test@test.com', 'Test User', 'http')
//                 .then(user => {
//                     // Assert
//                     userRepo.verify(x => x.createUser(anyUser), TypeMoq.Times.once());
//                     done();
//                 })
//                 .catch(err => {
//                     fail(err);
//                     done();
//                 });
//         });

//         it('does not create user if registration failed', done => {
//             // Arrange
//             const anyUser = TypeMoq.It.isAnyObject<User>(User);
//             userRepo.setup(x => x.createUser(anyUser)).returns(() => Promise.resolve()).verifiable();
//             const duplicateUser = User.Fixture({
//                 id: uuid4(),
//                 strategy: AuthStrategy.Basic,
//                 email: 'test@test.com',
//                 displayName: 'Test User',
//                 password: Password.Fixture({hash: '', salt: ''})
//             });
//             userRepo.setup(x => x.getUser(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyString())).returns(() => Promise.resolve(duplicateUser)).verifiable();

//             // Act
//             userService.registerBasicUser(AuthStrategy.Basic, 'test@test.com', 'Test User', 'http')
//                 .then(() => {
//                     fail('unexpected promise resolve');
//                     done();
//                 })
//                 .catch(err => {
//                     // Assert
//                     userRepo.verify(x => x.createUser(anyUser), TypeMoq.Times.never());
//                     expect(err.message).toEqual(`User with email ${duplicateUser.email} already exists.`);
//                     done();
//                 });
//         });

//         xit('sends password reset email', done => {
//             // Arrange
//             const anyUser = TypeMoq.It.isAnyObject<User>(User);
//             const mockUser = TypeMoq.Mock.ofType<IUser>();
//             mockUser.setup(x => x.initiatePasswordReset(dateProv.object, env.object)).returns(() => 'testtoken123').verifiable();
//             const userType = TypeMoq.Mock.ofType<typeof User>();
//             mockUser.setup(x => x.register(userRepo.object, TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyString(), TypeMoq.It.isAnyString())).returns(() => Promise.resolve(mockUser.object)).verifiable();
//             userRepo.setup(x => x.createUser(anyUser)).returns(() => Promise.resolve()).verifiable();
//             userRepo.setup(x => x.getUser(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyString())).returns(() => Promise.resolve(null)).verifiable();

//             // Act
//             userService.registerBasicUser(AuthStrategy.Basic, 'test@test.com', 'Test User', 'http')
//                 .then(user => {
//                     // Assert
//                     mockUser.verify(x => x.initiatePasswordReset(dateProv.object, env.object), TypeMoq.Times.once());
//                     done();
//                 })
//                 .catch(err => {
//                     fail(err);
//                     done();
//                 });
//         });
//     });

//     describe('register oauth', () => {

//         it('creates user on repository', done => {
//             // Arrange
//             const anyUser = TypeMoq.It.isAnyObject<User>(User);
//             userRepo.setup(x => x.createUser(anyUser)).returns(() => Promise.resolve()).verifiable();
//             userRepo.setup(x => x.getUser(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyString())).returns(() => Promise.resolve(null)).verifiable();

//             // Act
//             userService.registerOAuthUser(AuthStrategy.Facebook, 'test@test.com', 'Test User')
//                 .then(user => {
//                     // Assert
//                     userRepo.verify(x => x.createUser(anyUser), TypeMoq.Times.once());
//                     done();
//                 })
//                 .catch(err => {
//                     fail(err);
//                     done();
//                 });
//         });

//         it('does not create user if registration failed', done => {
//             // Arrange
//             const anyUser = TypeMoq.It.isAnyObject<User>(User);
//             userRepo.setup(x => x.createUser(anyUser)).returns(() => Promise.resolve()).verifiable();
//             const duplicateUser = User.Fixture({
//                 id: uuid4(),
//                 strategy: AuthStrategy.Facebook,
//                 email: 'test@test.com',
//                 displayName: 'Test User',
//                 password: new NullPassword()
//             });
//             userRepo.setup(x => x.getUser(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyString())).returns(() => Promise.resolve(duplicateUser)).verifiable();

//             // Act
//             userService.registerOAuthUser(AuthStrategy.Facebook, 'test@test.com', 'Test User')
//                 .then(() => {
//                     fail('unexpected promise resolve');
//                     done();
//                 })
//                 .catch(err => {
//                     // Assert
//                     userRepo.verify(x => x.createUser(anyUser), TypeMoq.Times.never());
//                     expect(err.message).toEqual(`User with email ${duplicateUser.email} already exists.`);
//                     done();
//                 });
//         });
//     });

//     describe('adding session', () => {
//         it('pushes a new token on successful retrieve of user', done => {
//             // Arrange
//             const mockUser = TypeMoq.Mock.ofType<IUser>();
//             mockUser.setup(x => x.addSession(TypeMoq.It.isAnyString())).verifiable();
//             mockUser.setup((x: any) => x.then).returns(() => undefined);
//             userRepo.setup(x => x.getUser(TypeMoq.It.isAnyNumber(), TypeMoq.It.isAnyString())).returns(() => Promise.resolve(mockUser.object)).verifiable();
//             userRepo.setup(x => x.saveUser(TypeMoq.It.isAnyObject<User>(User))).returns(() => Promise.resolve()).verifiable();

//             // Act
//             const token = 'testtoken';
//             const email = 'test@test.com';
//             userService.addSession(AuthStrategy.Basic, email, token)
//                 .then(() => {
//                     // Assert
//                     userRepo.verify(x => x.getUser(AuthStrategy.Basic, email), TypeMoq.Times.once());
//                     mockUser.verify(x => x.addSession(token), TypeMoq.Times.once());
//                     userRepo.verify(x => x.saveUser(mockUser.object), TypeMoq.Times.once());
//                     done();
//                 })
//                 .catch(err => {
//                     fail(err);
//                     done();
//                 });
//         });
//     });
// });
