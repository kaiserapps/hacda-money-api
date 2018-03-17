import { BaseHttpController, controller, httpGet, interfaces } from 'inversify-express-utils';

import { TYPES } from '../../../ioc.types';

@controller('/test/auth')
export class TestAuthController extends BaseHttpController implements interfaces.Controller {
    @httpGet('/anon')
    public anon() {
        return {
            user: this.httpContext.user
        }
    }

    @httpGet('/authenticated', TYPES.AuthorizeMiddleware)
    public authenticated() {
        return {
            user: this.httpContext.user
        }
    }

    @httpGet('/admin-only', TYPES.AdminAuthMiddleware)
    public adminOnly() {
        return {
            user: this.httpContext.user
        }
    }

    @httpGet('/audit-or-admin-only', TYPES.AuditAuthMiddleware)
    public auditOnly() {
        return {
            user: this.httpContext.user
        }
    }

    @httpGet('/user-or-admin-only', TYPES.UserAuthMiddleware)
    public userOnly() {
        return {
            user: this.httpContext.user
        }
    }
}
