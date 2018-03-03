import SendGrid = require('@sendgrid/mail');
import { inject, injectable } from 'inversify';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { IEmailProvider } from './email.provider.interface';

@injectable()
export class SendGridEmailProvider implements IEmailProvider {
    constructor(
        @inject(TYPES.Environment) public environment: IEnvironment,
    ) {
    }

    public sendEmail(email: string, subject: string, body: string, templateId: string, substitutions?: any): Promise<any> {
        if (!substitutions) {
            substitutions = {};
        }
        SendGrid.setApiKey(this.environment.sendGridApiKey || '');
        SendGrid.setSubstitutionWrappers('{', '}');
        const sendGridTemplates = this.environment.sendGridTemplates || {};
        const msg = {
            to: email,
            subject: subject,
            from: this.environment.emailFrom || '',
            text: body,
            html: body,
            templateId: sendGridTemplates[templateId],
            substitutions: substitutions
        };
        console.log(msg);
        return SendGrid.send(msg);
    }
}
