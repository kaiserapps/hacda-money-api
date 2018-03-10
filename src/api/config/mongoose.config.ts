import * as mongoose from 'mongoose';

import { UserSchema } from '../../domain/user/user.mongo.repository';
import { IEnvironment } from '../../environments/env.interface';

export class MongooseConfig {
    static SetupSchemas() {
        // setup schemas
        mongoose.model('User', new mongoose.Schema(UserSchema));
    }

    static Connect(settings: IEnvironment): Promise<{}> {
        (mongoose as any).Promise = global.Promise;
        if (!settings.connectionString) {
            throw new Error(`Connection string must be defined in one of the environment files.`);
        }
        return mongoose.connect(settings.connectionString);
    }
}
