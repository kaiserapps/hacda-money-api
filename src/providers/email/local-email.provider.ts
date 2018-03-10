import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import * as path from 'path';

import { IEnvironment } from '../../environments/env.interface';
import { TYPES } from '../../ioc.types';
import { IEmailProvider } from './email.provider.interface';

@injectable()
export class LocalEmailProvider implements IEmailProvider {
    constructor(
        @inject(TYPES.Environment) public environment: IEnvironment,
    ) {
    }

    sendEmail(email: string, subject: string, body: string, templateId: string, substitutions?: any): Promise<any> {
        const msg = {
            to: email,
            subject: subject,
            body: body,
            templateId: templateId,
            substitutions: substitutions
        };

        return new Promise<any>((resolve, reject) => {
            const emailPath = path.join(this.environment.localEmailPath || '', `email_${new Date().getTime()}.txt`);
            fs.writeFile(emailPath, JSON.stringify(msg), null, err => {
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
