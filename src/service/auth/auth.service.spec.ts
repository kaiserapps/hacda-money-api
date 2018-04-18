import { interfaces } from 'inversify-express-utils';
import * as TypeMoq from 'typemoq';
import * as uuid4 from 'uuid/v4';

import { IEnvironment } from '../../environments/env.interface';
import { IJwtProvider } from '../../providers/auth/jwt.provider.interface';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { MockHelper } from '../../testing/mock-helper';
import { IUserService } from '../user/user.service.interface';
import { AuthService } from './auth.service';
import { IUser, User } from '../../domain/user/user';
import { AuthStrategy } from '../../providers/auth/enums';
import { NullPassword } from '../../domain/user/password';
import { JwtPrincipal } from '../../providers/auth/jwt-principal';
import { UnauthenticatedPrincipal } from '../../providers/auth/unauthenticated-principal';

const Mock = TypeMoq.Mock;
const It = TypeMoq.It;
const Times = TypeMoq.Times;

describe('auth service', () => {

    describe('check token', () => {

        it('validates token', async done => {
            // Arrange
            const env = Mock.ofType<IEnvironment>();
            const jwtProv = Mock.ofType<IJwtProvider>();
            const userProv = Mock.ofType<IUserProvider>();
            const userSvc = Mock.ofType<IUserService>();
            const authService = new AuthService(env.object, userSvc.object, userProv.object, jwtProv.object);
            const token = 'testtoken';
            const mockPrincipal = Mock.ofType<interfaces.Principal>();
            const user = User.Fixture({
                id: uuid4(),
                strategy: AuthStrategy.Facebook,
                email: 'test@test.com',
                displayName: 'Test User',
                password: new NullPassword(),
                tokens: [token]
            });
            MockHelper.makeResolvable(mockPrincipal);
            jwtProv.setup(x => x.validateToken(It.isAnyString())).returns(() => Promise.resolve(mockPrincipal.object)).verifiable();
            userSvc.setup(x => x.findUser(It.isAny(), It.isAny())).returns(() => Promise.resolve(user));
            userProv.setup(x => x.user).returns(() => new JwtPrincipal(user));

            try {
                // Act
                await authService.checkToken(token);

                // Assert
                jwtProv.verify(x => x.validateToken(token), Times.once());
                done();
            }
            catch (err) {
                fail(err);
                done();
            }
        });

        it('fails if token is not validated', async done => {
            // Arrange
            const env = Mock.ofType<IEnvironment>();
            const jwtProv = Mock.ofType<IJwtProvider>();
            const userProv = Mock.ofType<IUserProvider>();
            const userSvc = Mock.ofType<IUserService>();
            const authService = new AuthService(env.object, userSvc.object, userProv.object, jwtProv.object);
            const token = 'testtoken';
            const expectedErr = 'error message';
            jwtProv.setup(x => x.validateToken(It.isAnyString())).returns(() => Promise.resolve(new UnauthenticatedPrincipal(expectedErr))).verifiable();

            try {
                // Act
                await authService.checkToken(token);
                fail('unexpected promise resolve');
                done();
            }
            catch (err) {
                userProv.verify(x => x.validate(It.isAny()), Times.never());
                userProv.verify(x => x.invalidate(), Times.never());
                expect(err).toEqual(new Error(expectedErr));
                done();
            }
        });

        it('fails if user does not have the token', async done => {
            // Arrange
            const env = Mock.ofType<IEnvironment>();
            const jwtProv = Mock.ofType<IJwtProvider>();
            const userProv = Mock.ofType<IUserProvider>();
            const userSvc = Mock.ofType<IUserService>();
            const authService = new AuthService(env.object, userSvc.object, userProv.object, jwtProv.object);
            const token = 'testtoken';
            const mockPrincipal = Mock.ofType<interfaces.Principal>();
            const user = User.Fixture({
                id: uuid4(),
                strategy: AuthStrategy.Facebook,
                email: 'test@test.com',
                displayName: 'Test User',
                password: new NullPassword(),
                tokens: []
            });
            MockHelper.makeResolvable(mockPrincipal);
            jwtProv.setup(x => x.validateToken(It.isAnyString())).returns(() => Promise.resolve(mockPrincipal.object)).verifiable();
            userSvc.setup(x => x.findUser(It.isAny(), It.isAny())).returns(() => Promise.resolve(user));
            userProv.setup(x => x.user).returns(() => new JwtPrincipal(user));
            userProv.setup(x => x.invalidate).verifiable();

            try {
                // Act
                await authService.checkToken(token);
                fail('unexpected promise resolve');
                done();
            }
            catch (err) {
                userProv.verify(x => x.invalidate(), Times.once());
                expect(err).toEqual(new Error(`Authorization token is invalid.`));
                done();
            }
        });
    });
});
