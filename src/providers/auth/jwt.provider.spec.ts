import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as TypeMoq from 'typemoq';
import * as uuid4 from 'uuid/v4';

import { IEnvironment } from '../../environments/env.interface';
import { IUserService } from '../../service/user/user.service.interface';
import { JwtProvider } from './jwt.provider';
import { User } from '../../domain/user/user';
import { AuthStrategy } from './enums';
import { NullPassword } from '../../domain/user/password';

const Mock = TypeMoq.Mock;
const It = TypeMoq.It;
const Times = TypeMoq.Times;

describe('jwt provider', () => {

    describe('validate token', () => {

        it('verifies token is valid', async done => {
            // Arrange
            const cert = new Buffer('cert');
            const token = 'token';
            const jwtSpy = spyOn(jwt, 'verify').and.callFake((t: string, c: Buffer, data: any, fn: (err: any, decoded: string) => void) => {
                fn(null, 'decoded token')
            });
            const fsReadSpy = spyOn(fs, 'readFileSync').and.returnValue(cert);

            // Act
            const jwtProv = new JwtProvider(Mock.ofType<IEnvironment>().object, Mock.ofType<IUserService>().object);
            const principal = await jwtProv.validateToken(token);
            const authed = await principal.isAuthenticated();

            // Assert
            expect(jwtSpy).toHaveBeenCalled();
            expect(authed).toBeTruthy();
            expect(principal.details).toBe('decoded token');
            done();
        });

        it('returns unauthenticated principal if not valid', async done => {
            // Arrange
            const cert = new Buffer('cert');
            const token = 'token';
            const jwtSpy = spyOn(jwt, 'verify').and.callFake((t: string, c: Buffer, data: any, fn: (err: any, decoded: null) => void) => {
                fn('token error', null)
            });
            const fsReadSpy = spyOn(fs, 'readFileSync').and.returnValue(cert);

            // Act
            const jwtProv = new JwtProvider(Mock.ofType<IEnvironment>().object, Mock.ofType<IUserService>().object);
            const principal = await jwtProv.validateToken(token);
            const authed = await principal.isAuthenticated();

            // Assert
            expect(jwtSpy).toHaveBeenCalled();
            expect(authed).toBeFalsy();
            done();
        });
    });

    describe('generate token', () => {

        it('signs token', async done => {
            // Arrange
            const cert = new Buffer('cert');
            const user = User.Fixture({
                id: uuid4(),
                strategy: AuthStrategy.Basic,
                email: 'test@test.com',
                displayName: 'Test User',
                password: new NullPassword()
            });
            const jwtSpy = spyOn(jwt, 'sign').and.callFake((payload: any, secret: jwt.Secret, options: jwt.SignOptions, fn: (err: any, decoded: string | null) => void) => {
                fn(null, 'token');
            });
            const fsReadSpy = spyOn(fs, 'readFileSync').and.returnValue(cert);

            const mockUserService = Mock.ofType<IUserService>();
            mockUserService.setup(x => x.addSession(It.isAnyNumber(), It.isAnyString(), It.isAnyString())).verifiable();

            // Act
            const jwtProv = new JwtProvider(Mock.ofType<IEnvironment>().object, mockUserService.object);
            const token = await jwtProv.generateToken(user);

            // Assert
            expect(jwtSpy).toHaveBeenCalled();
            expect(token).toBe('token');
            mockUserService.verify(x => x.addSession(AuthStrategy.Basic, 'test@test.com', 'token'), Times.once());
            done();
        });
    });
});
