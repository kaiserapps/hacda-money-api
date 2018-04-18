import * as TypeMoq from 'typemoq';
import theoretically from 'jasmine-theories';

import { IUser, User } from '../../domain/user/user';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { IEnvironment } from '../../environments/env.interface';
import { AuthStrategy } from '../../providers/auth/enums';
import { ICryptoProvider } from '../../providers/crypto/crypto.provider.interface';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { BasicUserService } from './basic-user.service';
import { IUserPasswordService } from './user-password.service.interface';
import { UserPasswordService } from './user-password.service';
import { IEmailProvider } from '../../providers/email/email.provider.interface';

const Mock = TypeMoq.Mock;
const It = TypeMoq.It;
const Times = TypeMoq.Times;

describe('user password service', () => {

    describe('reset password', () => {

        theoretically.it('sends email to activate account', [true, false], async (doActivate: boolean, done) => {
            // Arrange
            const env = Mock.ofType<IEnvironment>();
            const dateProv = Mock.ofType<IDateProvider>();
            const emailProv = Mock.ofType<IEmailProvider>();
            const passService = new UserPasswordService(env.object, dateProv.object, emailProv.object);
            const mockUser = Mock.ofType<IUser>();
            const token = 'testresettoken';
            const email = 'test@test.com';
            mockUser.setup(x => x.initiatePasswordReset(dateProv.object, env.object)).returns(() => token).verifiable();
            mockUser.setup(x => x.email).returns(() => email);
            emailProv.setup(x => x.sendEmail(It.isAnyString(), It.isAnyString(), It.isAnyString(), It.isAnyString(), It.isAny())).verifiable();

            try {
                // Act
                passService.resetPassword(mockUser.object, doActivate);

                // Assert
                mockUser.verify(x => x.initiatePasswordReset(dateProv.object, env.object), Times.once());
                emailProv.verify(x => x.sendEmail(email, doActivate ? 'Activate Account' : 'Reset Password', It.isAnyString(), 'accountManagement', It.isAny()), Times.once());
                (done || (() => {}))();
            }
            catch (err) {
                console.log('test');
                fail(err);
                (done || (() => {}))();
            }
        });

        it('sends email with reset token', async done => {
            // Arrange
            const env = Mock.ofType<IEnvironment>();
            const dateProv = Mock.ofType<IDateProvider>();
            const emailProv = Mock.ofType<IEmailProvider>();
            const emailSpy = jasmine.createSpyObj<IEmailProvider>('IEmailProvider', ['sendEmail']);
            const passService = new UserPasswordService(env.object, dateProv.object, emailSpy);
            const mockUser = Mock.ofType<IUser>();
            const token = 'testresettoken';
            const email = 'test@test.com';
            mockUser.setup(x => x.initiatePasswordReset(dateProv.object, env.object)).returns(() => token).verifiable();
            mockUser.setup(x => x.email).returns(() => email);
            env.setup(x => x.url).returns(() => 'testurl.com');
            env.setup(x => x.clientUrl).returns(() => 'testurl.com');

            try {
                // Act
                passService.resetPassword(mockUser.object, true);

                // Assert
                expect(emailSpy.sendEmail).toHaveBeenCalledWith(
                    email,
                    'Activate Account',
                    jasmine.stringMatching(token),
                    'accountManagement',
                    jasmine.anything()
                );
                done();
            }
            catch (err) {
                fail(err);
                done();
            }
        });
    });
});
