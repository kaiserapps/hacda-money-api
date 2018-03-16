import { injectable } from 'inversify';
import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

import { AuthStrategy } from '../../providers/auth/enums';
import { User } from './user';
import { IUserRepository } from './user.repository.interface';

@injectable()
export class UserMongoRepository implements IUserRepository {
    UserModel: mongoose.Model<any>;

    constructor() {
        this.UserModel = mongoose.model('User');
    }

    getUser(strategy: AuthStrategy, email: string): Promise<User | null> {
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

    createUser(user: User): Promise<void> {
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

    saveUser(user: User): Promise<void> {
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
