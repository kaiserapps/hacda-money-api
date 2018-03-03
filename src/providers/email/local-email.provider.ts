import * as fs from 'fs';

import { IEmailProvider } from './email.provider.interface';

export class LocalEmailProvider implements IEmailProvider {
    sendEmail(email: string, subject: string, body: string, templateId: string, substitutions?: any): Promise<any> {
        const msg = {
            to: email,
            subject: subject,
            body: body,
            templateId: templateId,
            substitutions: substitutions
        };

        return new Promise<any>((resolve, reject) => {
            fs.writeFile(`./test-emails/email_${new Date().getTime()}.txt`, msg, null, err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(msg);
                }
            });
        });
    }
}
