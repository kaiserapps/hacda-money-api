import { inject, injectable } from 'inversify';
import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

import { TYPES } from '../../ioc.types';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { Audit } from './audit';
import { IAuditRepository } from './audit.repository.interface';
import { AuditType } from './enums';

@injectable()
export class AuditMongoRepository implements IAuditRepository {
    AuditModel: mongoose.Model<any>;

    constructor(
        @inject(TYPES.DateProvider) public dateProvider: IDateProvider,
        @inject(TYPES.UserProvider) public userProvider: IUserProvider
    ) {
        this.AuditModel = mongoose.model('Audit');
    }

    createAudit(audit: Audit): Promise<void> {
        audit.username = this.userProvider.user && this.userProvider.user.details ? this.userProvider.user.details.email : 'Anonymous';
        audit.timestamp = this.dateProvider.currentDateTicks;
        return new Promise<void>((resolve: any, reject: any) => {
            const created = new this.AuditModel(audit);
            created.save((err: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
}

export const AuditSchema = {
    klass: {
        type: String,
        required: 'Audit Class is required.'
    },
    action: {
        type: Number,
        required: 'Audit Type is required.',
        enum: [
            AuditType.None,
            AuditType.Create,
            AuditType.Update,
            AuditType.Delete,
        ]
    },
    username: {
        type: String,
        required: 'Audit Username is required.'
    },
    timestamp: {
        type: Number,
        required: 'Audit Timestamp is required.'
    },
    data: {
        type: Schema.Types.Mixed
    }
};
