import { interfaces } from 'inversify-express-utils';

import { RoleType } from '../../domain/user/enums';
import { IUser } from '../../domain/user/user';

export class JwtPrincipal implements interfaces.Principal {
    private _details: IUser;

    get details(): IUser {
        return this._details;
    }

    constructor(
        details: any
    ) {
        this._details = details;
    }

    public isAuthenticated(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public isResourceOwner(resourceId: any): Promise<boolean> {
        return Promise.resolve(false);
    }

    public isInRole(role: string): Promise<boolean> {
        const roles = this.details.roles as RoleType[];
        if (roles) {
            return Promise.resolve(!!roles.find(x => x === +role));
        }
        else {
            return Promise.resolve(false);
        }
    }
}
