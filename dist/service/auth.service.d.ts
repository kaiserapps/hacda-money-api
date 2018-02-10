import { interfaces } from 'inversify-express-utils';
export declare class AuthService {
    getUser(): Principal;
}
export declare class Principal implements interfaces.Principal {
    details: any;
    constructor(details: any);
    isAuthenticated(): Promise<boolean>;
    isResourceOwner(resourceId: any): Promise<boolean>;
    isInRole(role: string): Promise<boolean>;
}
