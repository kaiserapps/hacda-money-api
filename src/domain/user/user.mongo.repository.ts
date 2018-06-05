import { inject, injectable } from 'inversify';
import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

import { TYPES } from '../../ioc.types';
import { AuthStrategy } from '../../providers/auth/enums';
import { Audit } from '../audit/audit';
import { IAuditRepository } from '../audit/audit.repository.interface';
import { AuditType } from '../audit/enums';
import { User } from './user';
import { UserRepository } from './user.repository';
import { IUserRepository } from './user.repository.interface';

@injectable()
export class UserMongoRepository extends UserRepository implements IUserRepository {
    UserModel: mongoose.Model<any>;

    constructor(
        @inject(TYPES.AuditRepository) public auditRepository: IAuditRepository
    ) {
        super();
        this.UserModel = mongoose.model('User');
    }

    async getUser(strategy: AuthStrategy, email: string): Promise<User | null> {
        return new Promise<User>((resolve: any, reject: any) => {
            this.UserModel.find({
                strategy: strategy,
                email: email
            }, (err: any, users: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(users.length ? users[0] : null);
                }
            });
        });
    }

    async createUser(user: User): Promise<void> {
        this.auditRepository.createAudit(new Audit(User.name, AuditType.Create, user));
        return new Promise<void>((resolve: any, reject: any) => {
            const newUser = new this.UserModel(user);
            newUser.save((err: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }

    async saveUser(user: User): Promise<void> {
        this.auditRepository.createAudit(new Audit(User.name, AuditType.Update, user));
        return new Promise<void>((resolve: any, reject: any) => {
            this.UserModel.findByIdAndUpdate(user._id, user, (err: any) => {
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

export const UserSchema = {
    strategy: {
        type: Number,
        required: 'Strategy is required.',
        enum: [
            AuthStrategy.Basic,
            AuthStrategy.Facebook,
            AuthStrategy.Github,
            AuthStrategy.Google
        ]
    },
    email: {
        type: String,
        required: 'Email is required.'
    },
    displayName: {
        type: String,
        required: 'Display Name is required.'
    },
    password: {
        hash: {
            type: String,
            required: 'Password hash is required.'
        },
        salt: {
            type: String,
            required: 'Password salt is required.'
        }
    },
    oAuthData: {
        type: Schema.Types.Mixed
    },
    locked: {
        type: Boolean
    },
    roles: [{ type: Number }],
    tokens: [{ type: String }]
};
