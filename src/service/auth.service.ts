import { interfaces } from 'inversify-express-utils';
import { injectable } from 'inversify';

@injectable()
export class AuthService {
    public getUser(): Principal {
        return new Principal("TestUser");
    }
}

export class Principal implements interfaces.Principal {
    public details: any;
    constructor(
        details: any
    ) {
        this.details = details;
    }
    public isAuthenticated(): Promise<boolean> {
        return Promise.resolve(true);
    }
    public isResourceOwner(resourceId: any): Promise<boolean> {
        return Promise.resolve(resourceId === 1111);
    }
    public isInRole(role: string): Promise<boolean> {
        return Promise.resolve(role === "admin");
    }
}