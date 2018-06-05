import * as mongoose from 'mongoose';

import { AuditSchema } from '../../domain/audit/audit.mongo.repository';
import { UserSchema } from '../../domain/user/user.mongo.repository';
import { IEnvironment } from '../../environments/env.interface';

export class MongooseConfig {
    static SetupSchemas() {
        // setup schemas
        mongoose.model('Audit', new mongoose.Schema(AuditSchema));
        mongoose.model('User', new mongoose.Schema(UserSchema));
    }

    static Connect(settings: IEnvironment): Promise<any> {
        if (settings.useInMemoryDb) {
            return Promise.resolve();
        }
        else {
            (mongoose as any).Promise = global.Promise;
            if (!settings.connectionString) {
                throw new Error(`Connection string must be defined in one of the environment files.`);
            }
            return mongoose.connect(settings.connectionString);
        }
    }
}
