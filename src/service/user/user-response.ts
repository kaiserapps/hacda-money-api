import { RoleType } from '../../domain/user/enums';
import { IUserData } from '../../domain/user/user';
import { AuthStrategy } from '../../providers/auth/enums';

export class UserResponse {
    id: string;
    strategy: AuthStrategy;
    strategyName: string;
    email: string;
    displayName: string;
    resetToken?: string;
    roles: {
        id: RoleType,
        name: string
    }[];

    constructor(
        user: IUserData
    ) {
        this.id = user.id;
        this.strategy = user.strategy;
        this.strategyName = AuthStrategy[user.strategy];
        this.email = user.email;
        this.displayName = user.displayName;
        this.resetToken = user.resetToken;
        this.roles = user.roles ? user.roles.map(v => {
            return {
                id: v,
                name: RoleType[v]
            };
        }) : [];
    }
}
