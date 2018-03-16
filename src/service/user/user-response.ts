import { RoleType } from '../../domain/user/enums';
import { User } from '../../domain/user/user';
import { AuthStrategy } from '../../providers/auth/enums';

export class UserResponse {
    id: string;
    strategy: AuthStrategy;
    strategyName: string;
    email: string;
    familyName: string;
    givenName: string;
    resetToken?: string;
    roles: {
        id: RoleType,
        name: string
    }[];

    constructor(
        user: User
    ) {
        this.id = user._id;
        this.strategy = user.strategy;
        this.strategyName = AuthStrategy[user.strategy];
        this.email = user.email;
        this.familyName = user.familyName;
        this.givenName = user.givenName;
        this.resetToken = user.resetToken;
        this.roles = user.roles.map(v => {
            return {
                id: v,
                name: RoleType[v]
            };
        });
    }
}