import * as TypeMoq from 'typemoq';

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

describe('user service', () => {
    let env: TypeMoq.IMock<IEnvironment>;
    let dateProv: TypeMoq.IMock<IDateProvider>;
    let emailProv: TypeMoq.IMock<IEmailProvider>;

    beforeAll(() => {
        env = Mock.ofType<IEnvironment>();
        dateProv = Mock.ofType<IDateProvider>();
        emailProv = Mock.ofType<IEmailProvider>();
    });

    describe('reset password', () => {

        it('sends email with reset token', async done => {
            // Arrange
            const passService = new UserPasswordService(env.object, dateProv.object, emailProv.object);
            const mockUser = Mock.ofType<IUser>();
            const token = 'testresettoken';
            const email = 'test@test.com';
            mockUser.setup(x => x.initiatePasswordReset(dateProv.object, env.object)).returns(() => token).verifiable();
            mockUser.setup(x => x.email).returns(() => email);
            emailProv.setup(x => x.sendEmail(It.isAnyString(), It.isAnyString(), It.isAnyString(), It.isAnyString(), It.isAny())).verifiable();

            try {
                // Act
                const sendEmailSpy = spyOn(emailProv.object, 'sendEmail');
                passService.resetPassword(mockUser.object, true);

                // Assert
                mockUser.verify(x => x.initiatePasswordReset(dateProv.object, env.object), Times.once());
                emailProv.verify(x => x.sendEmail(email, 'Active Account', It.isAnyString(), 'accountManagement', It.isAny()), Times.once());
                // expect(sendEmailSpy).toHaveBeenCalledWith([
                //     email,
                //     'Activate Account',
                //     jasmine.stringMatching(token),
                //     'accountManagement',
                //     jasmine.anything()
                // ])
                done();
            }
            catch (err) {
                fail(err);
            }
        });
    });
});
