import { injectable } from 'inversify';

import { RoleType } from '../../../domain/user/enums';
import { RoleAuthMiddleware } from './role-auth.middleware';

@injectable()
export class AdminAuthMiddleware extends RoleAuthMiddleware {
    constructor() {
        super([RoleType.Admin]);
    }
}
