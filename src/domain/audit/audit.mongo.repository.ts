import { inject, injectable } from 'inversify';
import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

import { TYPES } from '../../ioc.types';
import { IDateProvider } from '../../providers/date/date.provider.interface';
import { IUserProvider } from '../../providers/user/user.provider.interface';
import { Audit } from './audit';
import { AuditRepository } from './audit.repository';
import { IAuditRepository } from './audit.repository.interface';
import { AuditType } from './enums';

@injectable()
export class AuditMongoRepository extends AuditRepository implements IAuditRepository {
    AuditModel: mongoose.Model<any>;

    constructor(
        @inject(TYPES.DateProvider) dateProvider: IDateProvider,
        @inject(TYPES.UserProvider) userProvider: IUserProvider
    ) {
        super(dateProvider, userProvider);
        this.AuditModel = mongoose.model('Audit');
    }

    async createAudit(klass: string, action: AuditType, data?: any): Promise<void> {
        const audit = new Audit(klass, action, this.getDiff(klass, action, data));
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

    async getLatest(klass: string, max?: number): Promise<Audit> {
        return new Promise<Audit>((resolve: any, reject: any) => {
            this.AuditModel.findOne({
                klass: klass,
                timestamp: { $lt: max || this.dateProvider.currentDateTicks }
            }).sort({
                timestamp: -1
            }).exec((err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
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
