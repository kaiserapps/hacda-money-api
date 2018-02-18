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

    createUser(user: User): Promise<User> {
        return new Promise<any>((resolve: any, reject: any) => {
            const newUser = new this.UserModel(user);
            newUser.save((err: any, userOut: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(userOut);
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
    username: {
        type: String,
        required: 'Username is required.'
    },
    email: {
        type: String,
        required: 'Email is required.'
    },
    givenName: {
        type: String,
        required: 'Given Name is required.'
    },
    familyName: {
        type: String,
        required: 'Family Name is required.'
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
