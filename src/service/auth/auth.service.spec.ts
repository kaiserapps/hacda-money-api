import * as TypeMoq from 'typemoq';

import { IEnvironment } from '../../environments/env.interface';
import { IJwtProvider } from '../../providers/auth/jwt.provider.interface';
import { JwtStatic } from '../../providers/auth/jwt.static';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { IUserService } from '../user/user.service.interface';
import { AuthService } from './auth.service';

const Mock = TypeMoq.Mock;
const It = TypeMoq.It;
const Times = TypeMoq.Times;

describe('auth service', () => {
    let env: TypeMoq.IMock<IEnvironment>;
    let jwtProv: TypeMoq.IMock<IJwtProvider>;
    let userProv: TypeMoq.IMock<IUserProvider>;
    let userSvc: TypeMoq.IMock<IUserService>;

    beforeAll(() => {
        env = Mock.ofType<IEnvironment>();
        jwtProv = Mock.ofType<IJwtProvider>();
        userProv = Mock.ofType<IUserProvider>();
        userSvc = Mock.ofType<IUserService>();
    });

    describe('check token', () => {

        it('validates token', async done => {
            // Arrange
            const authService = new AuthService(env.object, userSvc.object, userProv.object);
            const token = 'testtoken';
            const jwtStaticMock = Mock.ofType<typeof JwtStatic>();
            jwtStaticMock.setup(x => x.getJwtProviderByToken(token, env.object, userSvc.object)).returns(() => Promise.resolve(jwtProv.object));
            jwtProv.setup(x => x.validateToken(token)).verifiable();

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
    });
});
