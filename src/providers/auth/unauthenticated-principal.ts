import { interfaces } from 'inversify-express-utils';

export class UnauthenticatedPrincipal implements interfaces.Principal {
    private _details: any;

    get details(): any {
        return this._details;
    }

    constructor(
        details?: any
    ) {
        this._details = details;
    }

    async isAuthenticated(): Promise<boolean> {
        return Promise.resolve(false);
    }

    async isResourceOwner(resourceId: any): Promise<boolean> {
        return Promise.resolve(false);
    }

    async isInRole(role: string): Promise<boolean> {
        return Promise.resolve(false);
    }
}
