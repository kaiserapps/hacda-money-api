import * as SendGrid from '@sendgrid/mail';
import * as TypeMoq from 'typemoq';

import { IEnvironment } from '../../environments/env.interface';
import { SendGridEmailProvider } from './sendgrid-email.provider';

const Mock = TypeMoq.Mock;
const It = TypeMoq.It;
const Times = TypeMoq.Times;

describe('sendgrid email provider', () => {

    describe('send email', () => {

        it('sets api key', done => {
            // Arrange
            const env = Mock.ofType<IEnvironment>();
            const sendGridProv = new SendGridEmailProvider(env.object);
            const apiKey = 'sendGridApiKey';
            env.setup(x => x.sendGridApiKey).returns(() => apiKey);
            const sgSpy = spyOn(SendGrid, 'setApiKey');
            spyOn(SendGrid, 'send');

            // Act
            sendGridProv.sendEmail('test@test.com', 'Test Subject', 'Test Body', '1234', {});

            // Assert
            expect(sgSpy).toHaveBeenCalledWith(apiKey);
            done();
        });

        it('sets substitution wrappers', done => {
            // Arrange
            const env = Mock.ofType<IEnvironment>();
            const sendGridProv = new SendGridEmailProvider(env.object);
            const wrappers = ['{', '}'];
            const sgSpy = spyOn(SendGrid, 'setSubstitutionWrappers');
            spyOn(SendGrid, 'setApiKey');
            spyOn(SendGrid, 'send');

            // Act
            sendGridProv.sendEmail('test@test.com', 'Test Subject', 'Test Body', '1234', {});

            // Assert
            expect(sgSpy).toHaveBeenCalledWith(...wrappers);
            done();
        });

        it('sends email', done => {
            // Arrange
            const env = Mock.ofType<IEnvironment>();
            const sendGridProv = new SendGridEmailProvider(env.object);
            const wrappers = ['{', '}'];
            const apiKey = 'sendGridApiKey';
            const from = 'from@test.com';
            env.setup(x => x.sendGridApiKey).returns(() => apiKey);
            env.setup(x => x.emailFrom).returns(() => from);
            env.setup(x => x.sendGridTemplates).returns(() => {
                return {
                    testTemplate: '1234'
                };
            });
            spyOn(SendGrid, 'setApiKey');
            spyOn(SendGrid, 'setSubstitutionWrappers');
            const sendSpy = spyOn(SendGrid, 'send');

            // Act
            sendGridProv.sendEmail('test@test.com', 'Test Subject', 'Test Body', 'testTemplate', {
                testSub: 'testSub'
            });

            // Assert
            expect(sendSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                to: 'test@test.com',
                subject: 'Test Subject',
                from: from,
                text: 'Test Body',
                html: 'Test Body',
                templateId: '1234',
                substitutions: {
                    testSub: 'testSub'
                }
            }));
            done();
        });
    });
});
